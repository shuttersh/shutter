# @shutter/builddata

Collects general build data from the project, like the git repository, current branch, current commit, package name, ...

This data will be used to group the uploaded snapshots and link to the code / pull request from the inspection dashboard.

## Supported CI Services

- Circle CI
- GitLab CI
- Jenkins CI
- Travis CI

Can also infer data from git repository and `package.json` file.
