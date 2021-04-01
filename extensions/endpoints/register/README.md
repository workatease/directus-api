### Register Endpoint

| Endpoint        | Method |
| :-------------- | -----: |
| custom/register |   POST |

Body

```
{
    "email": "johndow@test.com",
    "first_name": "John",
    "last_name": "Doe"
}
```

register user and send email verification email flow

1.  Register User with firstName and lastName and email
2.  Send Email with verification link
3.  Verify with Password using the existing [directus API](https://docs.directus.io/reference/api/rest/users/#accept-user-invite)

### Environment Variables

| Variable                 | Description                               | Default Value |
| ------------------------ | ----------------------------------------- | ------------- |
| `INVITE_TOKEN_EXPIRE_IN` | sets the expiry time for the invitation   | `7d` 7 days   |
| `REGISTER_USER_ROLE`     | default role the user to be registered as | `user`        |

### Permissions

---

- Public role permissions to be set for a better granular access
- Set Permission for Custom Register Endpoint for Public Role as below

Role Read
![image](https://user-images.githubusercontent.com/57198612/112697706-87b83b00-8e5e-11eb-9ba3-a9fe18aec3b4.png)
User Create
![image](https://user-images.githubusercontent.com/57198612/112697833-ccdc6d00-8e5e-11eb-857d-b86016be3cf8.png)
User field vaidation to secure the status user register endpoint
![image](https://user-images.githubusercontent.com/57198612/112697908-f09fb300-8e5e-11eb-8c95-13fe3434bd29.png)
