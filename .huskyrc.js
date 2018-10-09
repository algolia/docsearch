module.exports = {
  hooks: {
    'pre-commit': './scripts/precommit-dispatcher',
    'pre-push': './scripts/prepush-dispatcher',
  },
};
