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



  