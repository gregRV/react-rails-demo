class Comment extends React.Component {
  render() {
    return (
      <div className='comment'>
        <h2 className='commentAuthor'>
          {this.props.author}
        </h2>
        {this.props.comment}
      </div>
    );
  }
}

class CommentList extends React.Component {
  render() {
    var commentNodes = this.props.comments.map((comment, index) => {
      return <Comment author={comment.author} comment={comment.comment} key={index} />
    });

    return (
      <div className='commentList'>
        {commentNodes}
      </div>
    );
  }
}

class CommentForm extends React.Component {
  // NOTE: .getDOMNode() is deprecated- now use ReactDOM.findDOMNode()
  // BUT this method is NOT avail on ES6 components that extend React.Component
  // https://facebook.github.io/react/docs/component-api.html
  handleSubmit() {
    var author = this.refs.author.getDOMNode().value.trim();
    var comment = this.refs.comment.getDOMNode().value.trim();
    this.props.onSubmit({
      author: author,
      comment: comment
    });

    this.refs.author.getDOMNode().value('');
    this.refs.comment.getDOMNode().value('');
    // "always return false from event handlers to prevent
    // browsers default action of submitting the form"
    return false;
  }

  render() {
    return (
      <form className='commentForm' onSubmit={this.handleSubmit}>
        <input type='text' placeholder='Your name' ref='author' />
        <input type='text' placeholder='Say something...' ref='comment' />
        <input type='submit' value='Post' />
      </form>
    );
  }
}

class CommentBox extends React.Component {
  constructor(props) {
    // when using 'constructor' vs 'getInitialState':
    // always make call to super and pass in props
    super(props);
    // and ASSIGN this.state, rather than returning the object literal
    this.state = { comments: [] };
  }

  componentDidMount() {
    this.loadCommentsFromServer();
  }

  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: (comments) => {
        this.setState({ comments: comments });
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  handleCommentSubmit(comment) {
    var comments = this.state.comments;
    var newComments = comments.concat([comment]);
    this.setState({ comments: newComments });

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: {"comment": comment},
      success: (data) => {
        this.loadCommentsFromServer();
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  render() {
    return (
      <div className='commentBox'>
        <h1>New Comment</h1>
        <CommentForm onSubmit={this.handleCommentSubmit} />
        <h1>Comments</h1>
        <CommentList comments={this.state.comments} />
      </div>
    );
  }
}

// FOR USE IF WE DID NOT USE react_component HELPER
// var ready = function(){
//   ReactDOM.render(
//     <CommentBox url={"/comments.json"} />, document.getElementById('comments')
//   );
// };
// $(document).ready(ready);
