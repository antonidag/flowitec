import yaml from "js-yaml";

export const loadYamlToJson = (yamlText: string) => {
  
  //Load YAML to JSON
  const parsedData = yaml.load(yamlText) as string;

  return parsedData;
};

export const validateJsonToSchema = (json: object) => {

  //Validate JSON object
  const parsedData = json;

  return parsedData;
};