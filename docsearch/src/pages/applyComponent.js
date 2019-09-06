import React from "react";
import { Input, LabelText, Text, Button } from "@algolia/ui-library";

const MAX_WIDTH = "600px";
export default class ApplyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: "", email: "" };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleURLChange(event) {
    this.setState({ url: event.target.value });
  }
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    console.log("A name was submitted: " + this.state.value);
    // event.preventDefault();
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        id="form"
        style={{ maxWidth: MAX_WIDTH, margin: "auto" }}
        action="https://www.algolia.com/docsearch/join"
        method="POST"
      >
        <LabelText style={{ fontSize: "1.2em" }}>
          DOCUMENTATION URL:
          <Input
            type="url"
            name="url"
            value={this.state.url}
            onChange={this.handleURLChange}
            placeholder={"https://project.org/docs"}
            required
          />
          <Text style={{ fontSize: "0.6em" }}>
            We'll crawl pages at this address and index the content on Algolia
          </Text>
        </LabelText>
        <LabelText style={{ fontSize: "1.2em" }}>
          EMAIL:
          <Input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            placeholder={"you@project.orgs"}
            required
          />
          <Text style={{ fontSize: "0.6em" }}>
            We'll send you the JavaScript snippet you'll have to integrate into
            your documentation
          </Text>
        </LabelText>
        <button
          type="submit"
          form="form"
          value="Submit"
          style={{
            "border-color": "transparent",
            background: "none",
            width: "100%"
          }}
        >
          <Button primary>Join the program</Button>
        </button>

        <Text>
          Refer to Algolia's Privacy Policy for more information on how we use
          and protect your data
        </Text>
      </form>
    );
  }
}
