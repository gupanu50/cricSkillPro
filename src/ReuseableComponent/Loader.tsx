import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Grid, Fold, CircleFade, Circle } from 'react-native-animated-spinkit';
import { loaderProps } from '@/Types';
const Loader: React.FC<loaderProps> = ({ loading }) => {
    return (
        <>
            {loading && (
                <View style={styles.container}>
                    <Grid size={100} color={'#136548'} />
                </View>
            )}
        </>
    );
};
export default Loader;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
