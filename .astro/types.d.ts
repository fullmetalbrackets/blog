declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"5-ways-to-host-site-free.md": {
	id: "5-ways-to-host-site-free.md";
  slug: "5-ways-to-host-site-free";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"How-to-generate-GPG-to-sign-git-commits.md": {
	id: "How-to-generate-GPG-to-sign-git-commits.md";
  slug: "how-to-generate-gpg-to-sign-git-commits";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"autologin-ubuntu-on-reboot.md": {
	id: "autologin-ubuntu-on-reboot.md";
  slug: "autologin-ubuntu-on-reboot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"basic-linux-commands.md": {
	id: "basic-linux-commands.md";
  slug: "basic-linux-commands";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"bootstrapping-fresh-install-with-ansible.md": {
	id: "bootstrapping-fresh-install-with-ansible.md";
  slug: "bootstrapping-fresh-install-with-ansible";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"copy-ssh-keys-between-hosts.md": {
	id: "copy-ssh-keys-between-hosts.md";
  slug: "copy-ssh-keys-between-hosts";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"create-public-samba-share-without-login.md": {
	id: "create-public-samba-share-without-login.md";
  slug: "create-public-samba-share-without-login";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"customizing-windows-terminal-with-ohmyposh.md": {
	id: "customizing-windows-terminal-with-ohmyposh.md";
  slug: "customizing-windows-terminal-with-ohmyposh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"dns-over-https-backends.md": {
	id: "dns-over-https-backends.md";
  slug: "dns-over-https-backends";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"formatting-on-linux.md": {
	id: "formatting-on-linux.md";
  slug: "formatting-on-linux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"generating-an-ssh-key-pair.md": {
	id: "generating-an-ssh-key-pair.md";
  slug: "generating-an-ssh-key-pair";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"git-commands-cheat-sheet.md": {
	id: "git-commands-cheat-sheet.md";
  slug: "git-commands-cheat-sheet";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"guide-to-zsh-ohmyzsh-plugins-and-theme.md": {
	id: "guide-to-zsh-ohmyzsh-plugins-and-theme.md";
  slug: "guide-to-zsh-ohmyzsh-plugins-and-theme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"host-a-static-website-with-aws-amplify.md": {
	id: "host-a-static-website-with-aws-amplify.md";
  slug: "host-a-static-website-with-aws-amplify";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-to-format-partiton-linux.md": {
	id: "how-to-format-partiton-linux.md";
  slug: "how-to-format-partiton-linux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-to-run-filebrowser-in-docker.md": {
	id: "how-to-run-filebrowser-in-docker.md";
  slug: "how-to-run-filebrowser-in-docker";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-to-use-a-custom-prismjs-theme-with-nuxt-content.md": {
	id: "how-to-use-a-custom-prismjs-theme-with-nuxt-content.md";
  slug: "how-to-use-a-custom-prismjs-theme-with-nuxt-content";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-to-use-netlify-forms-in-a-nuxt-site.md": {
	id: "how-to-use-netlify-forms-in-a-nuxt-site.md";
  slug: "how-to-use-netlify-forms-in-a-nuxt-site";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"install-and-use-sudo-debian.md": {
	id: "install-and-use-sudo-debian.md";
  slug: "install-and-use-sudo-debian";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"install-docker-debian-ubuntu.md": {
	id: "install-docker-debian-ubuntu.md";
  slug: "install-docker-debian-ubuntu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"install-latest-nodejs-debian.md": {
	id: "install-latest-nodejs-debian.md";
  slug: "install-latest-nodejs-debian";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"install-nodejs-ubuntu-debian.md": {
	id: "install-nodejs-ubuntu-debian.md";
  slug: "install-nodejs-ubuntu-debian";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"keeping-a-linux-laptop-on-with-the-lid-closed.md": {
	id: "keeping-a-linux-laptop-on-with-the-lid-closed.md";
  slug: "keeping-a-linux-laptop-on-with-the-lid-closed";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"markdown-hacks.md": {
	id: "markdown-hacks.md";
  slug: "markdown-hacks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"merging-sites-and-changing-hosts.md": {
	id: "merging-sites-and-changing-hosts.md";
  slug: "merging-sites-and-changing-hosts";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"minimal-blog-deno-deploy.md": {
	id: "minimal-blog-deno-deploy.md";
  slug: "minimal-blog-deno-deploy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"mounting-hard-drives-in-linux.md": {
	id: "mounting-hard-drives-in-linux.md";
  slug: "mounting-hard-drives-in-linux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"openmediavault-quick-reference.md": {
	id: "openmediavault-quick-reference.md";
  slug: "openmediavault-quick-reference";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pi-hole-quad9-dls-over-tls.md": {
	id: "pi-hole-quad9-dls-over-tls.md";
  slug: "pi-hole-quad9-dls-over-tls";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pihole-rate-limiting.md": {
	id: "pihole-rate-limiting.md";
  slug: "pihole-rate-limiting";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"powershell-commands-cheat-cheat.md": {
	id: "powershell-commands-cheat-cheat.md";
  slug: "powershell-commands-cheat-cheat";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"quick-guide-setting-up-smb.md": {
	id: "quick-guide-setting-up-smb.md";
  slug: "quick-guide-setting-up-smb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"reverse-proxy-nginx-pihole.md": {
	id: "reverse-proxy-nginx-pihole.md";
  slug: "reverse-proxy-nginx-pihole";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"rsync-a-quick-guide.md": {
	id: "rsync-a-quick-guide.md";
  slug: "rsync-a-quick-guide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"self-host-website-cloudflare-tunnel.md": {
	id: "self-host-website-cloudflare-tunnel.md";
  slug: "self-host-website-cloudflare-tunnel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"set-static-ip-debian.md": {
	id: "set-static-ip-debian.md";
  slug: "set-static-ip-debian";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"set-up-pihole-on-linux.md": {
	id: "set-up-pihole-on-linux.md";
  slug: "set-up-pihole-on-linux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setting-up-a-container-stack-with-docker-compose.md": {
	id: "setting-up-a-container-stack-with-docker-compose.md";
  slug: "setting-up-a-container-stack-with-docker-compose";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setting-up-and-configuring-nuxt-sitemap-module-in-a-nuxt-content-blog.md": {
	id: "setting-up-and-configuring-nuxt-sitemap-module-in-a-nuxt-content-blog.md";
  slug: "setting-up-and-configuring-nuxt-sitemap-module-in-a-nuxt-content-blog";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setting-up-jellyfin-in-docker.md": {
	id: "setting-up-jellyfin-in-docker.md";
  slug: "setting-up-jellyfin-in-docker";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setting-up-plex-in-docker.md": {
	id: "setting-up-plex-in-docker.md";
  slug: "setting-up-plex-in-docker";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setting-up-sweet-potato-debian-pihole.md": {
	id: "setting-up-sweet-potato-debian-pihole.md";
  slug: "setting-up-sweet-potato-debian-pihole";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-a-samba-share-on-linux-via-command-line.md": {
	id: "setup-a-samba-share-on-linux-via-command-line.md";
  slug: "setup-a-samba-share-on-linux-via-command-line";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-cloudflare-tunnel-to-access-self-hosted-apps.md": {
	id: "setup-cloudflare-tunnel-to-access-self-hosted-apps.md";
  slug: "setup-cloudflare-tunnel-to-access-self-hosted-apps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-home-assistant-sweet-potato-debian.md": {
	id: "setup-home-assistant-sweet-potato-debian.md";
  slug: "setup-home-assistant-sweet-potato-debian";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-nfs-shares-linux.md": {
	id: "setup-nfs-shares-linux.md";
  slug: "setup-nfs-shares-linux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-photosync-with-smb-server.md": {
	id: "setup-photosync-with-smb-server.md";
  slug: "setup-photosync-with-smb-server";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-prometheus-cadvisor-grafana.md": {
	id: "setup-prometheus-cadvisor-grafana.md";
  slug: "setup-prometheus-cadvisor-grafana";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-ssh-authentication-to-push-to-github.md": {
	id: "setup-ssh-authentication-to-push-to-github.md";
  slug: "setup-ssh-authentication-to-push-to-github";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setup-unattended-upgrades.md": {
	id: "setup-unattended-upgrades.md";
  slug: "setup-unattended-upgrades";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sideload-the-directv-stream-app-on-sony-bravia-tv-with-android-tv.md": {
	id: "sideload-the-directv-stream-app-on-sony-bravia-tv-with-android-tv.md";
  slug: "sideload-the-directv-stream-app-on-sony-bravia-tv-with-android-tv";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"solid-explorer-samba-share.md": {
	id: "solid-explorer-samba-share.md";
  slug: "solid-explorer-samba-share";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"styling-the-kbd-element.md": {
	id: "styling-the-kbd-element.md";
  slug: "styling-the-kbd-element";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sudo-without-password.md": {
	id: "sudo-without-password.md";
  slug: "sudo-without-password";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"sync-bare-metal-pihole-with-container.md": {
	id: "sync-bare-metal-pihole-with-container.md";
  slug: "sync-bare-metal-pihole-with-container";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transferring-files-between-hosts-with-scp.md": {
	id: "transferring-files-between-hosts-with-scp.md";
  slug: "transferring-files-between-hosts-with-scp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"turn-off-display-linux-terminal.md": {
	id: "turn-off-display-linux-terminal.md";
  slug: "turn-off-display-linux-terminal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"turn-static-website-into-pwa.md": {
	id: "turn-static-website-into-pwa.md";
  slug: "turn-static-website-into-pwa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"using-dns-over-https-with-pihole.md": {
	id: "using-dns-over-https-with-pihole.md";
  slug: "using-dns-over-https-with-pihole";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"using-prismjs-in-a-nuxt-static-site.md": {
	id: "using-prismjs-in-a-nuxt-static-site.md";
  slug: "using-prismjs-in-a-nuxt-static-site";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"using-surge-sh-to-host-static-sites.md": {
	id: "using-surge-sh-to-host-static-sites.md";
  slug: "using-surge-sh-to-host-static-sites";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"vim-quick-guide.md": {
	id: "vim-quick-guide.md";
  slug: "vim-quick-guide";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};
"wiki": {
"ansible-files.md": {
	id: "ansible-files.md";
  slug: "ansible-files";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"apollo.md": {
	id: "apollo.md";
  slug: "apollo";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"inventory.md": {
	id: "inventory.md";
  slug: "inventory";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"korben.md": {
	id: "korben.md";
  slug: "korben";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"potato.md": {
	id: "potato.md";
  slug: "potato";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"powerline-fonts-bash-script.md": {
	id: "powerline-fonts-bash-script.md";
  slug: "powerline-fonts-bash-script";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"services.md": {
	id: "services.md";
  slug: "services";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"smb-config.md": {
	id: "smb-config.md";
  slug: "smb-config";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
"zsh-config-files.md": {
	id: "zsh-config-files.md";
  slug: "zsh-config-files";
  body: string;
  collection: "wiki";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"links": {
"chmod-calc": {
	id: "chmod-calc";
  collection: "links";
  data: InferEntrySchema<"links">
};
"color-picker": {
	id: "color-picker";
  collection: "links";
  data: InferEntrySchema<"links">
};
"composerize": {
	id: "composerize";
  collection: "links";
  data: InferEntrySchema<"links">
};
"crontab-guru": {
	id: "crontab-guru";
  collection: "links";
  data: InferEntrySchema<"links">
};
"css-filter": {
	id: "css-filter";
  collection: "links";
  data: InferEntrySchema<"links">
};
"font-awesome": {
	id: "font-awesome";
  collection: "links";
  data: InferEntrySchema<"links">
};
"iconify": {
	id: "iconify";
  collection: "links";
  data: InferEntrySchema<"links">
};
"json2yaml": {
	id: "json2yaml";
  collection: "links";
  data: InferEntrySchema<"links">
};
"layout-it": {
	id: "layout-it";
  collection: "links";
  data: InferEntrySchema<"links">
};
"meta-tags": {
	id: "meta-tags";
  collection: "links";
  data: InferEntrySchema<"links">
};
"neko-calc": {
	id: "neko-calc";
  collection: "links";
  data: InferEntrySchema<"links">
};
"pwa-builder": {
	id: "pwa-builder";
  collection: "links";
  data: InferEntrySchema<"links">
};
"pwa-image": {
	id: "pwa-image";
  collection: "links";
  data: InferEntrySchema<"links">
};
"real-favicon": {
	id: "real-favicon";
  collection: "links";
  data: InferEntrySchema<"links">
};
"realtime-colors": {
	id: "realtime-colors";
  collection: "links";
  data: InferEntrySchema<"links">
};
"rsyncinator": {
	id: "rsyncinator";
  collection: "links";
  data: InferEntrySchema<"links">
};
"svg-favicon": {
	id: "svg-favicon";
  collection: "links";
  data: InferEntrySchema<"links">
};
"ui-goodies": {
	id: "ui-goodies";
  collection: "links";
  data: InferEntrySchema<"links">
};
"what-is-viewport": {
	id: "what-is-viewport";
  collection: "links";
  data: InferEntrySchema<"links">
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
