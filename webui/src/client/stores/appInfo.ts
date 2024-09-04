import {
	getInitialPreviewVolume,
	checkInitialSlimDownloads,
	checkInitialSlimSidebar,
	checkInitialShowBitrateTags,
	checkInitialShowSearchButton,
} from "@/data/settings";
import { defineStore } from "pinia";

interface AppInfoState {
	currentCommit: string | null;
	latestCommit: string | null;
	updateAvailable: boolean;
	deemixVersion: string | null;
	previewVolume: number;
	hasSlimDownloads: boolean;
	hasSlimSidebar: boolean;
	showBitrateTags: boolean;
	showSearchButton: boolean;
}

export const useAppInfoStore = defineStore("appInfo", {
	state: (): AppInfoState => ({
		currentCommit: null,
		latestCommit: null,
		updateAvailable: false,
		deemixVersion: null,
		previewVolume: getInitialPreviewVolume(),
		hasSlimDownloads: checkInitialSlimDownloads(),
		hasSlimSidebar: checkInitialSlimSidebar(),
		showBitrateTags: checkInitialShowBitrateTags(),
		showSearchButton: checkInitialShowSearchButton(),
	}),
	getters: {
		appInfo: (state) => state,
	},
	actions: {
		setAppInfo(payload: AppInfoState) {
			this.currentCommit = payload.currentCommit;
			this.deemixVersion = payload.deemixVersion;
		},
		setUpdateInfo(payload: AppInfoState) {
			this.latestCommit = payload.latestCommit;
			this.updateAvailable = payload.updateAvailable;
		},
		setPreviewVolume(previewVolume: number) {
			this.previewVolume = previewVolume;
			localStorage.setItem("previewVolume", previewVolume.toString());
		},
		setSlimDownloads(slimDownloads: AppInfoState["hasSlimDownloads"]) {
			this.hasSlimDownloads = slimDownloads;
			localStorage.setItem("slimDownloads", slimDownloads.toString());
		},
		setSlimSidebar(slimSidebar: AppInfoState["hasSlimSidebar"]) {
			this.hasSlimSidebar = slimSidebar;
			localStorage.setItem("slimSidebar", slimSidebar.toString());

			// Moves all toast messages when the option changes
			Array.from(document.getElementsByClassName("toastify")).forEach(
				(toast) => {
					(toast as HTMLElement).style.transform = `translate(${
						slimSidebar ? "3rem" : "14rem"
					}, 0)`;
				}
			);
		},
		setShowBitrateTags(showBitrateTags: AppInfoState["showBitrateTags"]) {
			this.showBitrateTags = showBitrateTags;
			localStorage.setItem("showBitrateTags", showBitrateTags.toString());
		},
		setShowSearchButton(showSearchButton: AppInfoState["showSearchButton"]) {
			this.showSearchButton = showSearchButton;
			localStorage.setItem("showSearchButton", showSearchButton.toString());
		},
	},
});