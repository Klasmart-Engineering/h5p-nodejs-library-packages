# H5P NodeJS Library Packages

This repo compliments [h5p-nodejs-library](https://bitbucket.org/calmisland/h5p-nodejs-library).

It's troublesome to reference a particular package in a monorepo (lerna), so this repository is used to host the individual packages; one per branch. After building `h5p-nodejs-library`, commit the build artifacts of the desired package to the corresponding branch. It can then be referenced by a consumer project in package.json as `bitbucket:calmisland/h5p-nodejs-library-packages#h5p-server`, for example. Because of this convention, `main` branch will be unused, except for this README.
