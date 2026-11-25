import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const [action, projectOrFile, roundId, legacyBatchPath] = process.argv.slice(2);
const usage = 'Use: upload.mjs context <project-slug> | defaults | publish-batch <batch.json> | publish <project-slug> <round-id> <batch.json> | new-id';

async function connection() {
    const { DASHINGTESTERS_URL, DASHINGTESTERS_TOKEN, DASHINGTESTERS_TESTER_EMAIL } = process.env;
    if (DASHINGTESTERS_URL !== undefined || DASHINGTESTERS_TOKEN !== undefined) {
        return { url: DASHINGTESTERS_URL, token: DASHINGTESTERS_TOKEN, tester_email: DASHINGTESTERS_TESTER_EMAIL };
    }

    const profile = process.platform === 'win32'
        ? join(process.env.LOCALAPPDATA || homedir(), 'DashingTesters', 'connection.json')
        : join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'dashingtesters', 'connection.json');
    try {
        return JSON.parse((await readFile(profile, 'utf8')).replace(/^\uFEFF/, ''));
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {};
        }
        throw new Error('The DashingTesters connection profile could not be read.');
    }
}

async function readBatch(file, version) {
    let batch;
    try {
        batch = JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, ''));
    } catch {
        throw new Error('The checklist JSON file could not be read.');
    }
    if (batch?.schema_version !== version || typeof batch.import_id !== 'string' || !Array.isArray(batch.stories)) {
        throw new Error('The batch requires schema_version ' + version + ', an import_id, and a stories array.');
    }

    return JSON.stringify(batch);
}

async function main() {
    if (action === 'new-id') {
        console.log(randomUUID());
        return;
    }

    if (!['context', 'defaults', 'publish', 'publish-batch'].includes(action)) {
        throw new Error(usage);
    }

    const { url: base, token, tester_email: testerEmail } = await connection();
    if (action === 'defaults') {
        console.log(JSON.stringify({ tester_email: testerEmail ?? null }));
        return;
    }

    if (!base || !/^dt_[a-f0-9]{64}$/.test(token ?? '')) {
        throw new Error('Connect this machine with DASHINGTESTERS_URL and DASHINGTESTERS_TOKEN, or export the checklist for file import.');
    }

    const url = new URL(base);
    const isLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && isLoopback)) ||
        url.username || url.password || url.search || url.hash) {
        throw new Error('Use the dashboard’s HTTPS base URL. HTTP is supported only for local loopback testing.');
    }

    let endpoint = '/api/v1/story-imports';
    let body;
    if (action === 'publish-batch') {
        if (!projectOrFile) {
            throw new Error(usage);
        }
        body = await readBatch(projectOrFile, 2);
    } else {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectOrFile ?? '')) {
            throw new Error(usage);
        }
        endpoint = '/api/v1/projects/' + projectOrFile;
        if (action === 'publish') {
            if (!/^[1-9]\d*$/.test(roundId ?? '') || !legacyBatchPath) {
                throw new Error('Publishing a version 1 batch requires the open round ID and the JSON file.');
            }
            endpoint += '/rounds/' + roundId + '/story-imports';
            body = await readBatch(legacyBatchPath, 1);
        } else {
            endpoint += '/testing-context';
        }
    }

    url.pathname = url.pathname.replace(/\/+$/, '') + endpoint;
    const response = await fetch(url, {
        method: body ? 'POST' : 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + token,
            ...(body ? { 'content-type': 'application/json' } : {}),
        },
        body,
        redirect: 'error',
        signal: AbortSignal.timeout(20000),
    });

    const result = await response.json().catch(() => null);
    if (action === 'context' && result && [404, 409].includes(response.status)) {
        console.log(JSON.stringify({ status: response.status === 404 ? 'project_not_found' : 'no_open_round' }));
        return;
    }
    if (!response.ok || !result) {
        const detail = result?.errors ? Object.values(result.errors).flat().join(' ') : result?.message;
        throw new Error('DashingTesters returned HTTP ' + response.status + (detail ? '. ' + detail : '.'));
    }

    console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
