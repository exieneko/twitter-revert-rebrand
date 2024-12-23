const waitForElement = <T extends HTMLElement>(selectors: string[], callback: (element: T) => void) => {
    const doTheThing = () => {
        for (const selector of selectors) {
            const element = document.querySelector<T>(selector);

            if (element) {
                callback(element);
            }
        }
    };

    doTheThing();
    new MutationObserver(doTheThing).observe(document.body, { childList: true, subtree: true });
};

const waitForElements = <T extends HTMLElement>(selectors: string[], callback: (element: T) => void) => {
    const doTheThing = () => {
        for (const selector of selectors) {
            const elements = document.querySelectorAll<T>(selector);

            for (const element of elements) {
                callback(element);
            }
        }
    };

    doTheThing();
    new MutationObserver(doTheThing).observe(document.body, { childList: true, subtree: true });
};

const watchElement = <T extends HTMLElement>(selectors: string[], callback: (element: T) => boolean | void) => {
    let interval = setInterval(() => {
        for (const selector of selectors) {
            const element = document.querySelector<T>(selector);

            if (!element) {
                continue;
            }

            if (callback(element)) {
                clearInterval(interval);
            }
        }
    }, 50);
};

const getColor = () => {
    return document.querySelector<HTMLElement>('[href="/i/keyboard_shortcuts"]')?.style.color || '#1d9bf0';
};

const replaceText = (element: HTMLElement, findValue: string | RegExp, replaceValue: string) => {
    if (!element.textContent || !element.innerHTML) {
        return;
    }

    if (typeof findValue === 'string' ? element.textContent.includes(findValue) : findValue.test(element.textContent)) {
        element.innerHTML = element.innerHTML.replace(findValue, replaceValue);
    }
};

const replaceImage = (element: HTMLElement, imagePath: string, size: number) => {
    if (element.classList.contains('twitter-icon')) {
        return;
    }

    fetch(chrome.runtime.getURL(imagePath)).then(response => response.text()).then(text => {
        const content = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = content.querySelector<HTMLElement>('svg');
        const path = svg?.querySelector<HTMLElement>('path');

        element.innerHTML = path?.outerHTML || '<path></path>';

        element.setAttribute('viewBox', svg?.getAttribute('viewBox') || '0 0 16 16');
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.fill = getColor();

        element.classList.add('twitter-icon');
    });
};



if (window.location.hostname === 'x.com') {
    window.location.href = `https://twitter.com${window.location.pathname}?mx=1`;
}

watchElement<HTMLTitleElement>(['title' /* title */ ], element => {
    if (element.text === 'X') {
        element.text = 'Twitter';
        return;
    }

    const values = {
        '/ Twitter': /\/ X$/,
        'on Twitter': /(?<=.*)\bon X\b(?=: ".*" \/ (Twitter|X)$)/,
        'Retweeted': /(?<=Users.*)\breposted\b(?=.*\/ (Twitter|X)$)/,
        'Quote Tweets': /^Quotes(?= of this (post|Tweet) \/ (Twitter|X)$)/,
        'Tweet': /(?<=(Users|Quote Tweets).*)\bpost\b(?=.*\/ (Twitter|X)$)/,
        'Tweets': /^Posts(?= \/ (Twitter|X)$)/
    };

    for (const [key, value] of Object.entries(values)) {
        replaceText(element, value, key);
    }
});

waitForElement<HTMLAnchorElement>(['[rel~="icon"]' /* favicon */ ], element => {
    element.href = chrome.runtime.getURL('images/twitter-128.png');
});

waitForElement(['#placeholder > svg' /* loading icon */ ], element => {
    replaceImage(element, 'images/twitter.svg', 64);
});

waitForElement(['[aria-label="X"] svg' /* navbar icon */ ], element => {
    replaceImage(element, 'images/twitter.svg', 32);
});

waitForElements<HTMLElement>([
    'header nav[aria-label="Primary"] > a', // navbar items
    '#layers [data-testid="Dropdown"] > div > div > a' // navbar dropdown items
], element => {
    const disallowedLinks = ['/i/grok', '/jobs', '/i/premium_sign_up', '/i/verified-orgs-signup', '/i/monetization', 'https://ads.twitter.com/?ref=gl-tw-tw-twitter-ads-rweb', '/i/spaces/start'];

    if (element.style.display !== 'none' && disallowedLinks.includes(element.getAttribute('href') || '')) {
        element.style.display = 'none';
    }
});

waitForElements(['[data-testid="socialContext"]' /* retweeted text */ ], element => {
    replaceText(element, /\breposted$/, 'Retweeted');
});

waitForElement([
    '[data-testid="SideNav_NewTweet_Button"] span span span', // sidebar tweet button text
    '[data-testid="tweetButtonInline"] span span', // inline tweet button text
    '[data-testid="pillLabel"] span span span', // show new tweets popup
    '[data-testid="notification"] span span', // notification title (before username)
    '[dir="ltr"] div ~ span span', // notification title (after username)
    '.public-DraftEditorPlaceholder-inner' // reply placeholder
], element => {
    replaceText(element, 'post', 'Tweet');
    replaceText(element, 'Post', 'Tweet');
});

watchElement([
    '[data-testid="SideNav_NewTweet_Button"] span span span', // sidebar tweet button text
    '[data-testid="tweetButtonInline"] span span' // inline tweet button text
], element => {
    element.style.color = '#ffffff';
});

watchElement([
    '[data-testid="SideNav_NewTweet_Button"]', // sidebar tweet button
    '[data-testid="tweetButtonInline"]' // inline tweet button
], element => {
    element.classList.remove('r-jc7xae');
    element.style.backgroundColor = getColor();
});

waitForElement(['[data-testid="cellInnerDiv"] span' /* show new tweets button */ ], element => {
    replaceText(element, /\bposts$/, 'Tweets');
});

waitForElements(['[data-testid="trend"] > div > div:nth-child(3) > span' /* trending tweets */ ], element => {
    replaceText(element, /\bposts$/, 'Tweets');
});

waitForElements(['h2 > span' /* heading */ ], element => {
    if (document.querySelector('[aria-label="Home timeline"] h2 ~ div')?.textContent?.slice(1) !== window.location.pathname.slice(1).split('/', 1)[0]) {
        replaceText(element, 'post', 'Tweet');
        replaceText(element, 'Post', 'Tweet');
    }
});

waitForElements(['[role="tablist"] > [role="presentation"]' /* tabs */ ], element => {
    const span = element.querySelector('span');

    if (!span) {
        return;
    }

    replaceText(span, 'Reposts', 'Retweets');
    replaceText(span, 'Quotes', 'Quote Tweets');
    replaceText(span, 'Posts', 'Tweets');

    if (['Subs', 'Highlights', 'Articles', 'Verified Followers', 'Subscriptions', 'Verified'].includes(span.textContent || '')) {
        element.remove();
    }
});

waitForElements(['[role="menuitem"] span' /* menu items */ ], element => {
    if (element.textContent === 'Quote') {
        element.textContent = 'Quote Tweet';
    }

    replaceText(element, /\b[rR]epost\b/, 'Retweet');
    replaceText(element, /\bQuotes\b/, 'Quote Tweets');
    replaceText(element, /\bpost$/, 'Tweet');
});

waitForElements(['article div:has(> button[aria-label="Grok actions"])' /* grok button */ ], element => {
    element.remove();
});

waitForElement([
    '[data-testid="empty_state_header_text"] span', // tweet engagements empty (header)
    '[data-testid="empty_state_body_text"] span' // tweet engagements empty (body)
], element => {
    replaceText(element, 'Quotes', 'Quote Tweets');
    replaceText(element, 'quoted', 'Quote Tweeted');
    replaceText(element, 'Repost', 'Retweet');
    replaceText(element, 'repost', 'Retweet');
    replaceText(element, 'post', 'Tweet');
});

waitForElement<HTMLInputElement>(['[placeholder="Search"]' /* search bar placeholder */ ], element => {
    element.placeholder = 'Search Twitter';
});

waitForElement(['div:has(> div > [aria-label="Subscribe to Premium"])' /* sidebar twitter blue ad */ ], element => {
    element.remove();
});
