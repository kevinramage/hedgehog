# Extract

Extract system allow use to extract data from response body to save it in a variable and use it in next request.

## Parameters

| Name           | Required | Default | Description
| -------------- | -------- | ------- | -------------------
| content        | Yes      |         | Content to analyze. Now, the only value possible is ResponseBody
| regex          | Yes      |         | Regex to use to extract variable. The first group will be use to extract variable value
| flags          | No       | g       | Regex flags to use

## Example

```yaml
  requests:
    - url: http://localhost:8081/bodgeit/contact.jsp
      method: GET
      extracts:
        anticrf:
          content: ResponseBody
          regex: <input type="hidden" id="anticsrf" name="anticsrf" value="([0-9|\.]+)"><\/input>
    - url: http://localhost:8081/bodgeit/contact.jsp
      method: POST
      headers:
        Content-Type: application/x-www-form-urlencoded
      body: null=&anticsrf={{anticrf}}&comments={{payload}}
      proxy:
        server: localhost
        port: 8866
        username: test
        password: testPWD
```