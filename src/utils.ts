export function createErrorResponse(errors: any) {
  return {
    errorsMessages: errors.map((el: any) => ({
      message: el.msg,
      field: el.path,
    })),
  };
}
