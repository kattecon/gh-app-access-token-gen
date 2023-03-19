# Github App Access Token Generator

This Git repository contains a simple GitHub Action that generates a GitHub Access Token based upon specific inputs.

Access tokens are necessary in GitHub Actions when the built-in GITHUB_TOKEN does not provide the required permissions to perform certain actions. While the GITHUB_TOKEN is a convenient token that works for many common
actions, it may not be sufficient for all use cases. The GITHUB_TOKEN in GitHub Actions, when used to perform
tasks, [will not trigger new workflow runs](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow).
Because the GITHUB_TOKEN has limitations and cannot trigger new workflow runs in certain cases, actions that want to perform actions that trigger a workflow need to use a different token. An access token with the necessary permissions can be used for this purpose, and this action can be used to generate such a token.

The action takes in some inputs and uses them to create a token that can be used to interact with the GitHub API.

## Inputs

* **app_id**: Required. Number. Github App Id - found in the app settings.
* **installation_id**: Optional. Number. The ID of the app installation - found in url of an installation. If not provided, the default is the ID of the repository's installation.
* **private_key**: Required. String. The private key of the GitHub App in PEM format.

## Outputs

* **token**: The generated GitHub Access Token.
