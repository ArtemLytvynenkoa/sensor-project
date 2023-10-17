import {
  Button,
  Col,
  Divider,
  message,
  Row,
  Form as AntdForm,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Form, LoadingIndicator } from 'components';
import errorMessages from 'errorMessages';
import {
  auth,
  updateUser,
  getUserRef,
} from 'myFirebase';
import React, {
  useEffect,
  useState,
} from 'react';
import {
  useAuthState,
  useUpdateEmail,
  useUpdatePassword,
  useUpdateProfile,
} from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { profileForm } from 'utils';
import UserAvatarUpload from './UserAvatarUpload';

const { Item } = AntdForm;

const formStyle = { 
  margin: '0 auto',
  maxWidth: '300px'
};

const UserProfile = () => {
  const [isPasswordChangeVisible, setPasswordChangeVisible] = useState(false);

  const [form] = useForm();

  const [updateProfile, isProfileUpdeting, profileError] = useUpdateProfile(auth);
  const [updateEmail, isEmailUpdeting, emailError] = useUpdateEmail(auth);
  const [updatePassword, isPasswordUpdating, passwordError] = useUpdatePassword(auth);

  const [user] = useAuthState(auth);

  const [value, loading] = useDocument(getUserRef(user.uid));

  const userData = value?.data();

  useEffect(() => {
    if (profileError) {
      message.error(errorMessages[profileError.code]);

      return;
    }
    if (emailError) {
      message.error(errorMessages[emailError.code]);

      return;
    }
    if (passwordError) {
      message.error(errorMessages[passwordError.code]);
    }
  }, [emailError, passwordError, profileError]);

  if(loading) return <LoadingIndicator />

  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      style={ {
        height: '100vh',
        marginTop: '50px',
      } }
    >
      <Col 
        span={ 24 }
        style={{ 
          textAlign: 'center',
          paddingRight: '20px',
          paddingLeft: '20px',
        }}
      >
        <Form
          form={ form }
          isLoading={ isProfileUpdeting || isEmailUpdeting || loading}
          initialValues={ {
            userName: user?.displayName || userData?.userName,
            email: user?.email || userData?.email,
            phoneNumber: userData?.phoneNumber,
            photoURL: userData?.photoURL,
          } }
          style={ formStyle }
          fields={ [
            <Item key="userAvatar" name="photoURL" noStyle>
              <UserAvatarUpload userName={ userData?.userName } />
            </Item>,
            profileForm.userName,
            profileForm.email,
            profileForm.phoneNumber,
          ] }
          onSubmit={ async values => {
            await updateEmail(values.email);
            await updateProfile({
              displayName: values.userName,
              photoURL: values?.photoURL?.url || null,
            });
            try {
              if (!profileError && !emailError) {
                await updateUser({
                  email: values.email,
                  phoneNumber: values.phoneNumber,
                  userName: values.userName,
                  photoURL: values.photoURL,
                }, user.uid);
                message.success('Done');
              }
            } catch (error) {
              message.error(error.message);
            }
          } }
        />
        <Button
          type="primary"
          block
          onClick={ () => setPasswordChangeVisible(!isPasswordChangeVisible) }
          style={ formStyle }
        >
          { !isPasswordChangeVisible ? 'Change password' : 'Cancel' }
        </Button>
        { isPasswordChangeVisible &&
          <>
            <Divider />
            <Form
              form={ form }
              isLoading={ isPasswordUpdating }
              style={ formStyle }
              fields={ [
                profileForm.password,
                profileForm.confirmPass,
              ] }
              onSubmit={ async values => {
                if (values.password) {
                  await updatePassword(values.password);
                  form.resetFields(['password', 'confirmPass']);
                }
              } }
            />
          </>
        }
      </Col>
    </Row>
  );
};

export default UserProfile;
