import React from 'react';

const UserData = ({ user }) => {

    return (
        <tr>
            <td>{user?.id}</td>
            <td>{user?.name}</td>
            <td>{user?.email}</td>
            <td>{user?.company?.name}</td>
            <td>{user?.address?.zipcode}</td>
        </tr>
    );
};

export default UserData;