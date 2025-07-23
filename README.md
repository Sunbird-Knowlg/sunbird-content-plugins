# Content-Plugins

## Quick links

**Bugs**

- **[User Issues](https://github.com/ekstep/CE-Core-Plugins/issues?q=is%3Aopen+is%3Aissue+label%3A%22user+issues%22)**

| P1 to P4  | Severity 1 to 4  |
| --------- | --------- |
| [P1 bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP1%20)  | [severity 1 bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S1%22%20)  |
| [P2 bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP2%20)  | [severity 2  bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S2%22%20)  |
| [P3 bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP3%20)  | [severity 3  bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S3%22%20)  |
| [P4 bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP4%20)  | [severity 4  bugs](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S4%22%20)  |
|[**All bugs**](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3Abug)|[**Unclassified bugs**](https://github.com/ekstep/CE-Core-Plugins/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3ABug%20-label%3AP1%20-label%3AP2%20-label%3AP3%20-label%3AP4)|

## Developer Information

Repository of the EkStep Content Editor Plugins. These plugins are made available as reference and examples of how to accomplish certain tasks for the plugin developers. The code is made available under the MIT license. 

For detailed guide and instructions on developing the plugins, please visit the EkStep developer portal (http://community.ekstep.in/developers).

# Workflows

Workflow name: `Upload Content-Plugin to Blob`

- This GitHub Actions workflow automates the process of uploading the repository's contents to a cloud blob storage service (Google Cloud Storage, Azure Blob Storage, or AWS S3). This workflow triggers when a tag is created.

## Prerequisites

Before triggering this workflow, ensure the following:

- A valid Git tag is pushed to start the workflow.
- Required **GitHub Actions Variables** and **Secrets** are configured based on the selected cloud provider.

You can set **Variables and Secrets** in GitHub under:  
`Settings → Secrets and Variables → Actions`

---

## Cloud Provider Configuration

The workflow uses the `CLOUD_PROVIDER` variable to determine where to upload the build artifacts. Based on the provider selected, configure the following:

### GCP (Google Cloud Platform)

**Repository Variable:**
- `CLOUD_PROVIDER` = `gcp`
- `GCP_BUCKET` — Name of the GCP bucket to upload to.

**Repository Secret:**
- `GCP_SERVICE_ACCOUNT_KEY` — Base64-encoded GCP service account key.

---

### Azure

**Repository Variable:**
- `CLOUD_PROVIDER` = `azure`
- `AZURE_CONTAINER` — Name of the Azure Blob Storage container.

**Repository Secrets:**
- `AZURE_STORAGE_ACCOUNT` — Azure Storage account name.
- `AZURE_STORAGE_KEY` — Azure Storage account key.

---

### AWS (Amazon Web Services)

> **Note:** AWS upload is defined in the workflow but marked as **not tested**.

**Repository Variable:**
- `CLOUD_PROVIDER` = `aws`
- `S3_BUCKET` — Name of the AWS S3 bucket.
- `AWS_REGION` — AWS region where the bucket is located.

**Repository Secrets:**
- `AWS_ACCESS_KEY_ID` — AWS access key ID.
- `AWS_SECRET_ACCESS_KEY` — AWS secret access key.

---