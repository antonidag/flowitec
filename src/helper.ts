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

export const convertFlowToYaml = (nodes: any, edges: any) => {
  const flow = nodes.map((node) => {
    const component = {
      name: node.id,
      position: {
        x: node.position.x,
        y: node.position.y,
      },
    };

    // Add dependsOn based on edges
    const dependencies = edges
      .filter((edge) => edge.target === node.id)
      .map((edge) => edge.source);

    if (dependencies.length) {
      component.dependsOn = dependencies;
    }

    return component;
  });

  return yaml.dump({ flow });
};
