import type { Request, Response } from "express";
import { issueService } from "../services/issue.service";
import { sendResponse } from "../../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDB(req.body, req.user.id);
    sendResponse(
      res,
      {
        message: "Issue created successfully!",
        data: result,
      },
      StatusCodes.CREATED,
    );
  } catch (error: unknown) {
    sendResponse(
      res,
      {
        message: "Failed to create issue",
        errors:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB({
      sort: req.query.sort as string,
      type: req.query.type as string,
      status: req.query.status as string,
    });

    sendResponse(
      res,
      {
        message: "Issues retrieved successfully!",
        data: result,
      },
      StatusCodes.OK,
    );
  } catch (error: unknown) {
    sendResponse(
      res,
      {
        message: "Failed to retrieve issues",
        errors:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.getSingleIssueFrom(id as string);

    // if issue not found
    if (!result) {
      return sendResponse(
        res,
        {
          message: "Issues not found!",
          errors: "The requested issue does not exist",
        },
        StatusCodes.NOT_FOUND,
      );
    }
    // console.log(result);
    return sendResponse(
      res,
      {
        message: "Issues retrieved successfully!",
        data: result,
      },
      StatusCodes.OK,
    );
  } catch (error: unknown) {
    return sendResponse(
      res,
      {
        message: "Failed to retrieve issue",
        errors:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.updateIssueFromDB(
      req.body,
      id as string,
      req.user.id,
      req.user.role,
    );

    if (!result) {
      return sendResponse(
        res,
        {
          message: "Issue not found!",
          errors: "The requested issue does not exist",
        },
        StatusCodes.NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      {
        message: "Issues updated successfully",
        data: result,
      },
      StatusCodes.OK,
    );
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "You don't have permission to update this issue"
    ) {
      return sendResponse(
        res,
        {
          message: "Forbidden",
          errors: error.message,
        },
        StatusCodes.FORBIDDEN,
      );
    }
    return sendResponse(
      res,
      {
        message: "Failed to update issue",
        errors:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issueService.deleteIssueFromDB(id as string);

    if (!result) {
      return sendResponse(
        res,
        {
          message: "Issue not found!",
          errors: "The requested issue does not exist",
        },
        StatusCodes.NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      {
        message: "Issue deleted successfully",
      },
      StatusCodes.OK,
    );
  } catch (error: unknown) {
    return sendResponse(
      res,
      {
        message: "Failed to delete issue",
        errors:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
