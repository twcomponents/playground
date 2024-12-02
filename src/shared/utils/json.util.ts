export default class JsonUtil {
  public static stringToJsonObject = (jsonString: string): object | null => {
    try {
      // map keys
      jsonString = jsonString.replace(/(\w+):/g, '"$1":');

      // remove trailing commas at the end of the object
      jsonString = jsonString.replace(/,(?=\s*[\}\]])/g, '');

      return JSON.parse(jsonString);
    } catch (error) {
      console.error(error, jsonString.replace(/(\w+):/g, '"$1":'));
    }

    return null;
  };
}
