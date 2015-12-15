#!/usr/bin/env bash

set -e # exit when error

COMMIT_MSG=`git log --format=%B --no-merges -n 1`

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  MSG="No need to check pull request done on develop branch when not in a pull request"
  EXIT=0
elif [[ "$COMMIT_MSG" =~ "hotfix" ]] && [ "$TRAVIS_BRANCH" == 'master' ]; then
  MSG="Hotfix submitted to master, good"
  EXIT=0
elif [ "$TRAVIS_BRANCH" != 'develop' ]; then
  MSG="Pull request must be done on develop branch"
  EXIT=1
fi

echo $MSG;
exit $EXIT;
