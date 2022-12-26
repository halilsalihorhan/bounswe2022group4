import ChatBot from 'react-simple-chatbot';
const ChatBotComponent = () => {
  return (
    <ChatBot
      steps={[
        {
          id: '1',
          message: 'What is your name?',
          trigger: '2',
        },
        {
          id: '2',
          user: true,
          trigger: '3',
        },
        {
          id: '3',
          message: 'Hi {previousValue}, nice to meet you!',
          trigger: '4',
        },
        {
          id: '4',
          message: 'How can I help you?',
          trigger: '5',
        },
        {
          id: '5',
          options: [
            { value: 1, label: 'Medical Support', trigger: '6' },
            { value: 2, label: 'Usage Of Application', trigger: '7' },
          ],
        },
        {
          id: '6',
          message:
            "I'm sorry, but as a chatbot, I am not able to provide medical advice. I recommend contacting a medical professional for specific medical questions or concerns. Is there anything else I can help with?",
          trigger: '9',
        },
        {
          id: '7',
          message:
            'Can you provide more details about the issue you are having with the application?',
          trigger: '11',
        },

        {
          id: '9',
          options: [
            { value: 1, label: 'Yes, I have another question', trigger: '5' },
            { value: 2, label: 'No, that is all', trigger: '10' },
          ],
        },
        {
          id: '10',
          message: 'Thank you for contacting us. Have a nice day!',
          end: true,
        },
        {
          id: '11',
          options: [
            {
              value: 1,
              label: 'I want to post a medical issue',
              trigger: '12',
            },
            { value: 2, label: 'I want to comment under post', trigger: '13' },
            {
              value: 3,
              label: 'I want to make image annotation',
              trigger: '14',
            },
            {
              value: 4,
              label: 'I want to make text annotation',
              trigger: '15',
            },
            { value: 5, label: 'I want to upvote a post', trigger: '16' },
            { value: 6, label: 'I want to delete my post', trigger: '17' },
            { value: 7, label: 'I want to edit my post', trigger: '18' },
          ],
        },
        {
          id: '12',
          message:
            'If you haven’t already, please create an account. Then, you can post a medical issue by clicking on the “Create Post” button on the top left corner of the home page. You can also upload an image or a video to your post.',
          end: true,
        },
        {
          id: '13',
          message:
            "If you haven't already, please create an account. Then, you can comment under a post by clicking on the comment button under the post.",
          end: true,
        },
        {
          id: '14',
          message:
            ' You can make an image annotation by clicking and dragging on the image of the post.',
          end: true,
        },
        {
          id: '15',
          message:
            ' You can make a text annotation by selecting  the body of the post with your cursor.',
          end: true,
        },
        {
          id: '16',
          message:
            ' You can upvote a post by clicking on the upvote button on top right of the post.',
          end: true,
        },
        {
          id: '17',
          message:
            ' You can delete your post by clicking on the delete button on top right of the post.',
          end: true,
        },
        {
          id: '18',
          message:
            ' You can edit your post by clicking on the edit button on top right of the post.',
          end: true,
        },
      ]}
    />
  );
};

export default ChatBotComponent;
