import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, Form, Select, Option, TextField, Button } from '@forge/ui';
import api, { route } from "@forge/api";

const App = () => {
  const { platformContext: { issueKey } } = useProductContext();
  const [description, setDescription] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [action, setAction] = useState('');

  const fetchData = async () => {
    try {
      // Fetch issue details from Jira
      const issueResponse = await api.asApp().requestJira(route`/rest/api/2/issue/${issueKey}`);
      const { fields: { description, summary, project: { id } } } = await issueResponse.json();
      setDescription(description);

      // Example external fetch (adjust as needed)
      const response = await api.fetch(`https://fakestoreapi.com/products/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        setDescription(result.description); // Assuming 'result.description' is a field in the response
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (formData) => {
    setAction(formData.action);
    setAdditionalNotes(formData.additionalNotes || '');

    // if (formData.action === 'generateDescription') {
    //   //await fetchData(); // Fetch data if needed
    // } else if (formData.action === 'generateSubtasks') {
    //   console.log('Generate Subtasks selected');
    //   // Add logic to generate subtasks
    // }
  };


  return (
    <Fragment>
    <Form onSubmit={handleSubmit}>
      <Select label="Groom Task" name="action" value={action} onChange={value => setAction(value)}>
        <Option label="Generate Description" value="generateDescription" />
        <Option label="Generate Subtasks" value="generateSubtasks" />
      </Select>
      {/* {action === "generateDescription" && (
        <Fragment>
          <TextField label="Additional Notes" name="additionalNotes" defaultValue={additionalNotes} onChange={value => setAdditionalNotes(value)} />
          <Button text="Submit" />
        </Fragment> */}
      {/* )} */}
    </Form>
    {/* {description && <Text>Description: {description}</Text>} */}
  </Fragment>
  );
};

export const run = render(<IssuePanel><App /></IssuePanel>);
