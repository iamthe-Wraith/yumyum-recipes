export const parseFormData = async <T extends object>(request: Request) => {
  const data = await request.formData();

  const entries = [...data.entries()];

  const body: Record<string, any> = {};

  for(const [key, value] of entries) {
    if (value instanceof File) {
      body[key] = value.valueOf() as File;
    } else if (key.includes('[]')) {
      const newKey = key.replace('[]', '');

      if (body[newKey]) {
        body[newKey].push(value.toString());
      } else {
        body[newKey] = [value.toString()];
      }
    } else {
      body[key] = value.toString();
    }
  }

  return body as T;
}