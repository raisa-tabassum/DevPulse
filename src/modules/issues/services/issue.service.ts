import { pool } from "../../../db";
import type { Role } from "../../../types";
import type { IIssue } from "../issue.interface";

const createIssueIntoDB = async (payload: IIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues (
      title,
      description,
      type,
      reporter_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: {
  sort?: string;
  type?: string;
  status?: string;
}) => {
  const { sort = "newest", type, status } = query;

  const result = await pool.query(`
    SELECT * FROM issues
  `);

  let issues = [...result.rows];

  // Filter by type
  if (type) {
    issues = issues.filter((issue) => issue.type === type);
  }

  // Filter by status
  if (status) {
    issues = issues.filter((issue) => issue.status === status);
  }

  // Sort by created_at
  issues.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    if (sort === "oldest") {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  // Reporter information
  const issueWithReporter = await Promise.all(
    issues.map(async (issue) => {
      const reporter = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id],
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporter.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    }),
  );
  return issueWithReporter;
};

const getSingleIssueFrom = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  // Reporter information
  const issue = result.rows[0];

  const reporter = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id],
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: reporter.rows[0],

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueFromDB = async (
  payload: IIssue,
  id: string,
  userId: number,
  userRole: Role,
) => {
  const { title, description, type, status } = payload;

  // check issue in database
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  if (issueResult.rows.length === 0) {
    return null;
  }

  const issue = issueResult.rows[0];

  // contributors permission
  if (userRole === "contributor") {
    if (issue.reporter_id !== userId || issue.status !== "open") {
      throw new Error("You don't have permission to update this issue");
    }

    // contributor can't update status
    const result = await pool.query(
      `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [title, description, type, id],
    );

    return result.rows[0];
  }

  // maintainer can update any issue
  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      status = COALESCE($4, status),
      updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result.rows[0];
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFrom,
  updateIssueFromDB,
  deleteIssueFromDB,
};
