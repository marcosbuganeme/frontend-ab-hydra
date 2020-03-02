import React from "react";
import PropTypes from "prop-types";
import Button from "components/CustomButtons/Button.js";
import defaultImage from "assets/img/image_placeholder.jpg";
import defaultAvatar from "assets/img/placeholder.jpg";
import pdf from "assets/img/pdf2.jpg";

export default function FileUpload(props) {
  const [file, setFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(props.avatar ? defaultAvatar : defaultImage);

  let fileInput = React.createRef();

  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(pdf);
    };

    reader.readAsDataURL(file);
  };

  // eslint-disable-next-line
  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(props.avatar ? defaultAvatar : defaultImage);
    fileInput.current.value = null;
  };

  let { avatar, addButtonProps, removeButtonProps } = props;

  return (
    <div className="fileinput text-center" style={{ marginLeft: '10px', marginTop: '10px', float: 'right' }}>
      <input type="file" onChange={handleImageChange} ref={fileInput} />
      <div className={"thumbnail img-circle"} >
        <img src={imagePreviewUrl} alt="..." />
      </div>
      <div>
        {
          file === null
            ? (<Button {...addButtonProps} size="sm" onClick={() => handleClick()}>Anexar PDF</Button>)
            : (
              <span>
                {avatar ? <br /> : null}
                <Button
                  {...removeButtonProps}
                  size="sm"
                  onClick={() => handleRemove()}>
                  <i className="fas fa-times" /> Remover
                </Button>
              </span>
            )
        }
      </div>
    </div>
  );
}

FileUpload.propTypes = {
  avatar: PropTypes.bool,
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object
};
