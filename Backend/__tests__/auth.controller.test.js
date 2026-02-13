const httpMocks = require("node-mocks-http");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const { signup } = require("../controllers/authController");
const pendingUserModel = require("../models/pendingUserModel");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");

//!Mocks
jest.mock("../../models/pendingUserModel");
jest.mock("../../models/userModel");
jest.mock("../../utils/sendEmail");
jest.mock("bcryptjs");

describe("Signup Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      body: {
        name: "Mohamed",
        email: "test@test.com",
        password: "123456",
      },
    });

    res = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send OTP and create pending user", async () => {
    userModel.findOne.mockResolvedValue(null);
    bcryptjs.hash.mockResolvedValue("hashedPassword");

    pendingUserModel.findOneAndUpdate.mockResolvedValue({
      email: "test@test.com",
    });

    sendEmail.mockResolvedValue(true);

    await signup(req, res, next);

    expect(bcryptjs.hash).toHaveBeenCalledWith("123456", 12);

    expect(pendingUserModel.findOneAndUpdate).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@test.com",
        subject: expect.any(String),
        message: expect.stringContaining("OTP"),
      }),
    );

    expect(res.statusCode).toBe(201);

    const data = res._getJSONData();
    expect(data.message).toBe("OTP sent to your email");
  });

  it("should return error if email already exists", async () => {
    userModel.findOne.mockResolvedValue({ email: "test@test.com" });

    await signup(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Email already in use");
  });

  it("should return error if sending email fails", async () => {
    userModel.findOne.mockResolvedValue(null);
    bcryptjs.hash.mockResolvedValue("hashedPassword");

    pendingUserModel.findOneAndUpdate.mockResolvedValue({
      email: "test@test.com",
    });

    sendEmail.mockRejectedValue(new Error("Email failed"));

    await signup(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Failed to send OTP email");
  });
});
