import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // figure out where the index.js file is stored
        // the filter is a regex expression that controls when onResolve and onLoad are called.
        // in this case, it is called for every single file that is being loaded
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
