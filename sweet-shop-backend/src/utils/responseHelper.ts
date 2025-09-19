export function successResponse(res: any, data: any, status = 200) {
  return res.status(status).json(data);
}

export function errorResponse(res: any, message: string, status = 400) {
  return res.status(status).json({ message });
}
