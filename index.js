'use strict';

chrome.browserAction.onClicked.addListener(main);

async function main() {
    setBadgeText(`0%`);
    const data = {
        students: await getStudents(),
        tasks: await getTasksDefinition(organizationId),
        instances: {},
    };
    for (const [index, student] of data.students.entries()) {
        console.log(`${index + 1} / ${data.students.length}`);
        setBadgeText(`${Math.floor(index * 100 / data.students.length)}%`);
        for (let task of await getTasks(student.student_id)) {
            const {id} = task;
            data.instances[id] = {
                task,
                taskDetails: await getTaskDetails(id)
            };
        }
    }
    setBadgeText(`…`);
    console.log(data);

    saveDataToCache(data)
        .then(() => {
            downloadJson(data.instances, `instances.json`);
            downloadJson(data.students, `students.json`);
            downloadJson(data.tasks, `tasks.json`);

            for (const {taskDetails} of Object.values(data.instances)) {
                for (const {attachments} of taskDetails) {
                    for (const {id, url, filename} of attachments) {
                        download(
                            `https://codein.withgoogle.com${url}`,
                            `${id}_${filename}`
                        );
                    }
                }
            }

            setBadgeText(``);
        });
}

async function getStudents() {
    return fetch(`https://codein.withgoogle.com/api/program/2018/organization_student/?page=1&page_size=100`);
}

async function getTasksDefinition(organizationId) {
    return fetch(`https://codein.withgoogle.com/api/program/2018/taskdefinition/?my_tasks=false&organization=${organizationId}&page=1&page_size=100`);
}

async function getTasks(studentId) {
    return fetch(`https://codein.withgoogle.com/api/program/2018/taskinstance/?claimed_by=${studentId}&my_tasks=false&page=1&page_size=100`);
}

async function getTaskDetails(taskId) {
    return fetch(`https://codein.withgoogle.com/api/program/current/taskupdate/?page=1&page_size=100&task_instance=${taskId}`);
}

const ALL = -1;
async function fetch(url, count = ALL) {
    const items = [];
    while (true) {
        const {results, next} = await $.getJSON(url);
        items.push(...results);
        if (!next) {
            break;
        }

        if ($.isFunction(count) && count(results, next)) {
            url = next;
        } else if (count === ALL || items.length < count) {
            url = next;
        } else {
            break;
        }
    }
    return (count > 0) ? items.slice(0, count) : items;
}

function download(url, filename) {
    chrome.downloads.download({
        url, filename,
        // conflictAction: 'prompt', // Crashes the app
    }, () => {
    });
}

function downloadJson(data, filename) {
    download(URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], {type: `application/json`})),
        filename
    );
}

function saveDataToCache(data) {
    return new Promise((resolve) => {
        chrome.storage.local.clear();
        chrome.storage.local.set(data);
        resolve();
    });
}

function setBadgeText(text) {
    chrome.browserAction.setBadgeText({text}, () => {
    });
}
