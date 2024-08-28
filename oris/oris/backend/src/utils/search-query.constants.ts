const PIPELINE_PREFIX = 'pipeline';
const STAGE_PREFIX = 'stage';

const pipelineFields = [
    'id', 'status', 'name', 'application', 'buildNumber', 'url', 'startTime', 'endTime', 'duration', 'service'
];
const stageFields = [
    'id', 'status', 'name', 'jobUrl', 'startTime', 'endTime', 'duration'
];
const appFields = [
    'appName', 'appRevision', 'appUpgradedFrom', 'appUpgradedTo', 'appDuration'
]


export const addPrefix = (fields: string[], prefix: string) => {
    return fields.map(field => `${prefix}.${field}`);
}

export const pipelineSourceResponse = addPrefix(pipelineFields, PIPELINE_PREFIX);
export const stageSourceResponse = addPrefix(stageFields, STAGE_PREFIX);
export const stageSourceResponseForUpgradedAppsResponse = addPrefix(stageFields.concat(appFields), STAGE_PREFIX);

export const  COMBINED_SOURCE = pipelineSourceResponse.concat(stageSourceResponse);
export const  COMBINED_SOURCE_FOR_APPS_DATA = pipelineSourceResponse.concat(stageSourceResponseForUpgradedAppsResponse);

export const HELM_UPGRADE_STAGE = 'Upgrade using Helmfile';
export const PIPELINE_STATUS_KEYWORDS = ['SUCCEEDED', 'TERMINAL'];
export const STAGE_STATUS_KEYWORDS = ["SUCCEEDED", "FAILED_CONTINUE"];