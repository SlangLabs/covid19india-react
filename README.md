# covid19india with Slang integration

#### This repo was cloned from - [https://github.com/covid19india/covid19india-react](https://github.com/covid19india/covid19india-react) and we added a voice interface and reordered the content to make it easier for voice consumption.

<p align="center">
<img src="https://lh3.googleusercontent.com/c1R9ua5XDaInXNNYEVKs5NzwQ36gYCXi1VJ5kLRxGcDYmyUSJM3dnkzqaPWP_CniaHQbQSr4yQqxmsoEGvGFrWFnBRAVjI4=s2560" width="50%">
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
export const buddyId = "<buddy_id>"
export const apiKey = "<api_key>"
```

you can get / create api key and buddy ID [here](https://console.slanglabs.in/#signup)

## Run

Once you've completed the above steps you can start developing

```
$ yarn start
```

## Maintainers

- [SlangLabs](https://github.com/SlangLabs/)
