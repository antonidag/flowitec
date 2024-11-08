import yaml from "js-yaml";

interface IntegrationContext {
  name: string;
  description: string;
  flow: Component[];
}
interface Component {
  name: string;
  optional: boolean;
  entry: boolean;
  dependsOn: string[];
}

export const parseYamlToIntegrationContext = (yamlText: string) => {
  const parsedData = yaml.load(yamlText) as IntegrationContext;

  return parsedData;
};
