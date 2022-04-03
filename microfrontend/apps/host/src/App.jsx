import React, { Suspense, lazy, useEffect, useState } from "react";

function loadComponent(scope, module) {
    return async () => {
        await __webpack_init_sharing__("default");
        const container = window[scope];

        await container.init(__webpack_share_scopes__.default);
        const factory = await window[scope].get(module);
        const Module = factory();

        return Module;
    };
}

const urlCache = new Set();
const useDynamicScript = (url) => {
    const [ready, setReady] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);

    useEffect(() => {
        if (!url) {
            return;
        }

        if (urlCache.has(url)) {
            setReady(true);
            setErrorLoading(false);
            return;
        }

        setReady(false);
        setErrorLoading(false);

        const element = document.createElement("script");

        element.src = url;
        element.type = "text/javascript";
        element.async = true;

        element.onload = () => {
            urlCache.add(url);
            setReady(true);
        };

        element.onerror = () => {
            setReady(false);
            setErrorLoading(true);
        };

        document.head.appendChild(element);

        return () => {
            urlCache.delete(url);
            document.head.removeChild(element);
        };
    }, [url]);

    return {
        errorLoading,
        ready,
    };
};

const componentCache = new Map();

export const useFederatedComponent = (remoteUrl, scope, module) => {
    const [Component, setComponent] = useState(null);
    const { ready, errorLoading } = useDynamicScript(remoteUrl);

    const key = `${remoteUrl}-${scope}-${module}`;

    useEffect(() => {
        if (Component) {
            setComponent(null);
        }
    }, [key]);

    useEffect(() => {
        if (ready && !Component) {
            const LazyComponent = lazy(loadComponent(scope, module));
            componentCache.set(key, LazyComponent);
            setComponent(LazyComponent);
        }
    }, [Component, ready, key]);

    return { errorLoading, Component };
};

export const App = () => {
    const authPage = useFederatedComponent(
        "http://localhost:3002/remoteEntry.js",
        "auth",
        "./AuthPage"
    );

    const homePage = useFederatedComponent(
        "http://localhost:3003/remoteEntry.js",
        "home",
        "./HomePage"
    );

    return (
        <div>
            <h1>@microfrontend/host</h1>
            <div style={{ marginTop: "2em" }}>
                <Suspense fallback="Loading auth page">
                    {authPage.errorLoading
                        ? `Error loading auth page`
                        : authPage.Component && <authPage.Component />}
                </Suspense>
                <Suspense fallback="Loading home page">
                    {homePage.errorLoading
                        ? `Error loading home page`
                        : homePage.Component && <homePage.Component />}
                </Suspense>
            </div>
        </div>
    );
};
