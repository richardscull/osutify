import next from "eslint-config-next/core-web-vitals";

const config = [
  ...next,
  {
    // New in eslint-plugin-react-hooks v6 (shipped with the flat config, never run
    // by the old .eslintrc). Off until the 8 flagged effects are refactored.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
