import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const [action, project, roundId, batchPath] = process.argv.slice(2);

async function main() {
    if (action === 'new-id') {
        console.log(randomUUID());
        return;
    }

    if (!['context', 'publish'].includes(action) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project ?? '')) {
        throw new Error('Use: upload.mjs context <project-slug> | publish <project-slug> <round-id> <batch.json> | new-id');
    }

    const base = process.env.DASHINGTESTERS_URL;
    const token = process.env.DASHINGTESTERS_TOKEN;
    if (!base || !/^dt_[a-f0-9]{64}$/.test(token ?? '')) {
        throw new Error('Set DASHINGTESTERS_URL and DASHINGTESTERS_TOKEN in this machine’s environment.');
    }

    const url = new URL(base);
    const isLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && isLoopback)) ||
        url.username || url.password || url.search || url.hash) {
        throw new Error('Use the dashboard’s HTTPS base URL. HTTP is supported only for local loopback testing.');
    }

    let suffix = 'testing-context';
    let body;
    if (action === 'publish') {
        if (!/^[1-9]\d*$/.test(roundId ?? '') || !batchPath) {
            throw new Error('Publishing requires the open round ID and a batch JSON file.');
        }

        suffix = 'rounds/' + roundId + '/story-imports';
        const batch = JSON.parse((await readFile(batchPath, 'utf8')).replace(/^\uFEFF/, ''));
        if (batch.schema_version !== 1 || typeof batch.import_id !== 'string' || !Array.isArray(batch.stories)) {
            throw new Error('The batch requires schema_version 1, an import_id, and a stories array.');
        }
        body = JSON.stringify(batch);
    }

    url.pathname = url.pathname.replace(/\/+$/, '') + '/api/v1/projects/' + project + '/' + suffix;
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
