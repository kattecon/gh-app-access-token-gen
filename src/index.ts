import { getInput, info, setFailed, setOutput, setSecret } from "@actions/core";
import { getOctokit } from "@actions/github";
import { createAppAuth } from "@octokit/auth-app";

const asErrorMsg = (error: unknown): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-member-access
    return `${(error as any)?.message ?? error}`;
};

const main = async (): Promise<void> => {
    const appId = getInput("app_id", { required: true });
    const privateKey = getInput("private_key", { required: true });
    const repository = getInput("repository", { required: true });
    const installationIdInput = getInput("installation_id");

    // Request a temporary token for the application itself (by using the given app id and the private key).
    const appAuth = createAppAuth({ appId, privateKey });
    const appAuthToken = (await appAuth({ type: "app" })).token;

    // Create octokit object to make request using the given app token.
    const appAuthOctokit = getOctokit(appAuthToken);

    // Get installation id either from input or deduce it from the repository name..
    const installationId = await (async (): Promise<number> => {
        if (installationIdInput) {
            // Parse installationIdInput as number and validate.
            const result = Number(installationIdInput);
            if (`${result}` !== installationIdInput) {
                throw new Error(`Invalid installation id: ${installationIdInput}`);
            }
            return result;
        } else {
            // Get installation id using the repository name if the installation id is not provided.

            const [owner, repo] = repository.split("/");

            info(
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
    setSecret(accessToken);
    setOutput("token", accessToken);
    info("Successfully generated an app installation access token (as 'token' output).");
};

// Run the main function and catch any errors.
try {
    await main();
} catch (error) {
    setFailed(asErrorMsg(error));
}
