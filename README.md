# orbit-deployment-ui
 Introducing the Orbit Chain Deployment Interface, a user-friendly tool to effortlessly deploy your own Orbit Chain. This repository streamlines the setup process, allowing developers to focus on their decentralized applications.

## Getting Started
This tool utilizes Next.JS framework. To run this tool, first start the development server:

```bash
npm run dev
# or
yarn dev

```

You can first build the project and then start it:

```bash
yarn build
# then
yarn start

```

Now open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment Procedure

1. Navigate to the main page where you will find four selectable options. Click on the Parameters tab.
2. On the Parameters page, you have the ability to specify your desired Configuration Parameters. Once you have adjusted these to your satisfaction, confirm by sending the transaction.
3. Upon successful deployment, you are presented with two choices: either set a Batch Poster or Define Validators.
4. If you select the Batch Poster option, you will be directed to a new page. Here, you can add the desired address as a new Batch Poster by signing the transaction and then sending it.
5. If you choose to Set Validators, you will be led to another page where you can determine the number of validators you wish to add or remove. In the generated box, enter the corresponding addresses. Checking the checkbox next to each address signals your intent to add that particular address to the validator.
