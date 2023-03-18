export const parseFormData = async <T extends object>(request: Request) => {
  const data = await request.formData();

  const entries = [...data.entries()];

  const body: Record<string, any> = {};

  for(const [key, value] of entries) {
    if (value instanceof File) {
      body[key] = value;
    } else {
      body[key] = value.toString();
    }
  }

  return body as T;
}