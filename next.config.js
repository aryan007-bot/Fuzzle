/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		// Suppress noisy runtime-critical dependency warnings coming from
		// server-only packages (keyv / got) that are pulled in by some
		// Aptos SDK sub-dependencies. These are non-fatal but clutter the build.
		config.ignoreWarnings = config.ignoreWarnings || [];
		config.ignoreWarnings.push((warning) => {
			try {
				const message = warning && warning.message;
				if (!message) return false;
				// Match the common warning text emitted by webpack when a dependency
				// is requested via a dynamic expression (e.g. require(expr)).
				if (/the request of a dependency is an expression/i.test(message)) return true;
				if (/Critical dependency: the request of a dependency is an expression/i.test(message)) return true;
			} catch (e) {
				// ignore
			}
			return false;
		});

		return config;
	},
};

module.exports = nextConfig;
