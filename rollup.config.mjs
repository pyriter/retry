import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    dir: "dist",
    format: "es",
  },
  plugins: [typescript()]
};
