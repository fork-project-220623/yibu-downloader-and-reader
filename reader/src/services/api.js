/* eslint-disable no-debugger */
export const BASE_DIR = `/reader`;
export const BOOKS_ROOT_DIR = `${BASE_DIR}/books/`;

function getJSON(url) {
    return fetch(url, {
        method: "GET"
    }).then(data => data.json());
}

export function getBooksDir() {
    const key = `${BASE_DIR}/books/list`;
    let promise = null
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        if (data && data.length) {
            promise = Promise.resolve(data);
        }
    } catch (ex) {
        console.warn("getBooksDir: ", ex);
    }
    if (!promise) {
        promise = getJSON(`${BASE_DIR}/api/books`);
    }
    getJSON(`${BASE_DIR}/api/books`).then(res => {
        localStorage.setItem(key, JSON.stringify(res));
    });
    return promise;
}

export function getBookCategoryTree(bookId) {
    return getJSON(`${BOOKS_ROOT_DIR}${bookId}/raw/categories.json`);
}
export function getChapterContent(bookId, contentId) {
    return getJSON(`${BOOKS_ROOT_DIR}${bookId}/raw/${contentId}.json`);
}

export function iterableTree(tree, callback) {
    if (!tree.children) {
        tree.children = [];
    }
    callback(tree);
    if (tree.children.length) {
        tree.children.forEach(t => iterableTree(t, callback));
    }
}
export function getBookInfo(id) {
    const key = `${BASE_DIR}/book/info/${id}`;
    try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data && data.success) {
            return Promise.resolve(data);
        }
    } catch (ex) {
        console.warn("getBookInfo: ", ex);
    }
    const promise = getJSON(`${BASE_DIR}/api/book-info/${id}`);
    promise.then(res => {
        localStorage.setItem(key, JSON.stringify(res));
    });
    return promise;
}
export function getRecentBooks(count) {
    count = parseInt(count);
    if (isNaN(count) || count <= 0) {
        count = 5;
    }
    return Promise.resolve(getBooksProgress().sort((prev, next) => next.date - prev.date).slice(0, count));
}

/**
 * 获取读书进度
 * @returns {[{bookId: string, date: number, chapterId: string}]}
 */
export function getBooksProgress() {
    try {
        return JSON.parse(localStorage.getItem(`${BASE_DIR}/books/progress`) || "[]");
    } catch (ex) {
        console.warn("getBooksProgress: ", ex);
        return [];
    }
}
/**
 * 设置读书进度
 * @param {[]} progressData 进度数据
 * @returns {void}
 */
export function updateBooksProgress(progressData) {
    localStorage.setItem(`${BASE_DIR}/books/progress`, JSON.stringify(progressData));
}

export function getOrSetSettings(newSettings) {
    const key = `${BASE_DIR}/settings`;
    if (arguments.length === 1) {
        const value = JSON.stringify(newSettings);
        console.log("update settings: ", value);
        localStorage.setItem(key, value);
    } else {
        try {
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (err) {
            console.log("getOrSetSettings: ", err);
            return {
                all: {
                    pageWidth: null
                }
            };
        }
    }

}