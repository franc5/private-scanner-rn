# private-scanner-rn

A FOSS Android app without trackers to turn your device into a camera.

## ⚠️⚠️ Disclaimer ⚠️⚠️

This project is still in progress, the app is not finished yet and I don't have much time to work on it.
You will find many `TODO`s here and there and potentially, some bugs.
There's plenty of room for improvement, but I'll take care of this as I have time.

## Screenshots

![Corners detection](https://user-images.githubusercontent.com/64472239/221890704-1e2ec19c-7ef1-47e5-937d-93b1253b6e7c.png)


## Instalation

```
# First, clone the repo and cd to it

# Install dependencies
yarn

# Run the app (on an Android device/emulator)
yarn android
```

## TODO List

- [ ] Choose a license (GPL3?)
- [ ] Tackle `TODO`s from code
- [ ] Clean up opencv related files? - See comment message: https://github.com/franc5/private-scanner-rn/commit/8d0ac518344167a7f36e85faf3ed3be47009e2ec
- [ ] Crate a workflow to build the app (a stage of the workflow should be to download opencv, I don't want it to be part of the repo as it's a third party dependency and also to prevent changes on it to make the app more reliable/audiable in terms of privacy).
- [ ] Create a workflow to publish the app on F-Droid.

**Note:** Regarding opencv related files clean ap task, I'd prefer
