import {createBrowserRouter, redirect} from "react-router";
import {SandboxPage} from "@/pages/sandbox";

export const router = createBrowserRouter([
    {
        path: '/',
        loader: () => redirect('/sandbox')
    },
    {
        path: '/sandbox',
        Component: SandboxPage,
    }
])