import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";

function asErrorMsg(error: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${(error as any)?.message ?? error}`;
}

async function main(): Promise<void> {
    const appId = core.getInput("app_id", { required: true });
    const privateKey = core.getInput("private_key", { required: true });
    const repository = core.getInput("repository", { required: true });
    const installationIdInput = core.getInput("installation_id");

    // Request a temporary token for the application itself (by using the given app id and the private key).
    const appAuth = createAppAuth({ appId, privateKey });
    const appAuthToken = (await appAuth({ type: "app" })).token;

    // Create octokit object to make request using the given app token.
    const appAuthOctokit = getOctokit(appAuthToken);

    // Get installation id either from input or deduce it from the repository name..
    const installationId = await (async (): Promise<number> => {
        if (installationIdInput) {
            // parse installationIdInput as number and validate.
            const installationId = Number(installationIdInput);
            if (`${installationId}` !== installationIdInput) {
                throw new Error(`Invalid installation id: ${installationIdInput}`);
            }
            return installationId;
        } else {
            // Get installation id using the repository name if the installation id is not provided.

            const [owner, repo] = repository.split("/");

            core.info(
                `Installation id is not provided as input for the action. Getting installation for the app for the owner='${owner}', repository='${repo}'.`,
            );

            try {
                return (
                    await appAuthOctokit.rest.apps.getRepoInstallation({
                        owner,
                        repo,
                    })
                ).data.id;
            } catch (error) {
                const cause = asErrorMsg(error);
                throw new Error(
                    `Unable to find an app installation for the owner='${owner}' and repository='${repo}': ${cause}`,
                );
            }
        }
    })();

    // Get the installation access token.
    const accessToken = (
        await appAuthOctokit.rest.apps.createInstallationAccessToken({
            installation_id: installationId,
        })
    ).data.token;

    // Mask newly generated token in outputs, set the result and write a msg to console.
    core.setSecret(accessToken);
    core.setOutput("token", accessToken);
    core.info("Successfully generated an app installation access token (as 'token' output).");
}

// Run the main function and catch any errors.
try {
    await main();
} catch (error) {
    core.setFailed(asErrorMsg(error));
}
