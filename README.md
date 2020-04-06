# covid19india with Slang integration

#### This repo was cloned from - [https://github.com/covid19india/covid19india-react](https://github.com/covid19india/covid19india-react) and we added a voice interface and reordered the content to make it easier for voice consumption.

<p align="center">
<img src="https://i.postimg.cc/66gnPSsg/Screen-Shot-1.jpg" width="60%">
</p>

<p align="center">
  View the <a href="https://bit.ly/patientdb">live patient database</a>.
 </p>

## Setup

```
$ yarn
```

## Voice Setup

Add the `./src/voice/buddy.js` file with the code below.

```
export const buddyId = "452fbf69c61f4267bff368cffaff1ffa"
export const apiKey = "15744c52d8f14c72a6720cdd081617af"
```

You can edit the slang voice buddy [here](https://console.slanglabs.in/#signin)
with these credentials

user: `console.demo@slanglabs.in`

pass: `YourVoiceBuddy`

_Alternatively, you can create your own account and buddy [here](https://console.slanglabs.in/#signup)_

## Run

Once you've completed the above steps you can start developing

```
$ yarn start
```

## Maintainers

- [SlangLabs](https://github.com/SlangLabs/)
