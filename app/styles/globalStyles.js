import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E2E2E',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 50,
    },
    input: {
        backgroundColor: '#5A5A5A',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        color: 'white',
    },
    generalButton: {
        backgroundColor: '#58C658',
        borderRadius: 10,
        padding: 15,
        margin:5,
        alignItems: 'center',
    }
});

export default globalStyles;