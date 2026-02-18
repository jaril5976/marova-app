import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../theme/theme';
import { useAuth } from '../hooks/useAuth';
import { useCurrentUser } from '../imports/User/hooks/useCurrentUser';
import { Mail, Calendar, Smartphone, ChevronDown, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const FormInput = ({ label, value, onChangeText, placeholder, icon: Icon, keyboardType = 'default', error }: any) => (
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
            {Icon && <Icon size={20} color={COLORS.textMuted} style={styles.inputIcon} />}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textMuted}
                keyboardType={keyboardType}
                autoCapitalize="words"
            />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
);

const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    // Handle yyyy-mm-dd or yyyy-mm-ddT...
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatDateForPayload = (year: string, month: string, day: string) => {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const capitalizeFirstLetter = (text: string) => {
    return text.replace(/\b\w/g, char => char.toUpperCase());
};

export const AccountSettingsScreen = () => {
    const { currentUserData } = useCurrentUser();
    const { updateUser, isUpdatingProfile } = useAuth();
    const navigation = useNavigation<any>();

    const [firstName, setFirstName] = useState(currentUserData?.firstName || '');
    const [lastName, setLastName] = useState(currentUserData?.lastName || '');
    const [email, setEmail] = useState(currentUserData?.email || '');
    const [phone, setPhone] = useState(currentUserData?.phone || '');
    const [gender, setGender] = useState(currentUserData?.gender || '');
    const [dob, setDob] = useState(currentUserData?.dateOfBirth || '');
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [errors, setErrors] = useState<any>({});

    // For the custom picker state
    const [selectedDay, setSelectedDay] = useState('01');
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedYear, setSelectedYear] = useState('2000');

    const dayScrollRef = useRef<ScrollView>(null);
    const monthScrollRef = useRef<ScrollView>(null);
    const yearScrollRef = useRef<ScrollView>(null);

    const ITEM_HEIGHT = 44; // Fixed height for each picker item

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    useEffect(() => {
        if (currentUserData) {
            setFirstName(currentUserData.firstName || '');
            setLastName(currentUserData.lastName || '');
            setEmail(currentUserData.email || '');
            setPhone(currentUserData.phone || '');
            setGender(currentUserData.gender || '');

            if (currentUserData.dateOfBirth) {
                const date = new Date(currentUserData.dateOfBirth);
                if (!isNaN(date.getTime())) {
                    const y = date.getFullYear().toString();
                    const m = (date.getMonth() + 1).toString().padStart(2, '0');
                    const d = date.getDate().toString().padStart(2, '0');
                    setDob(`${y}-${m}-${d}`);
                    setSelectedYear(y);
                    setSelectedMonth(m);
                    setSelectedDay(d);
                } else {
                    setDob(currentUserData.dateOfBirth);
                }
            }
        }
    }, [currentUserData]);

    useEffect(() => {
        if (isDatePickerVisible) {
            // Small delay to ensure refs are ready
            setTimeout(() => {
                const dayIdx = parseInt(selectedDay) - 1;
                const monthIdx = parseInt(selectedMonth) - 1;
                const yearIdx = new Date().getFullYear() - parseInt(selectedYear);

                dayScrollRef.current?.scrollTo({ y: dayIdx * ITEM_HEIGHT, animated: false });
                monthScrollRef.current?.scrollTo({ y: monthIdx * ITEM_HEIGHT, animated: false });
                yearScrollRef.current?.scrollTo({ y: yearIdx * ITEM_HEIGHT, animated: false });
            }, 100);
        }
    }, [isDatePickerVisible]);

    // Adjust selected day if it's too high for the new month/year
    useEffect(() => {
        const daysInMonth = getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear));
        if (parseInt(selectedDay) > daysInMonth) {
            setSelectedDay(daysInMonth.toString().padStart(2, '0'));
        }
    }, [selectedMonth, selectedYear]);

    const handleConfirmDate = () => {
        const formattedDate = formatDateForPayload(selectedYear, selectedMonth, selectedDay);
        setDob(formattedDate);
        setIsDatePickerVisible(false);
    };

    const handleUpdate = () => {
        const newErrors: any = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First Name is required';
        }
        if (!lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        }
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone Number is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const payload = {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dateOfBirth: dob,
            addresses: currentUserData?.addresses || []
        };
        console.log('Update User Payload:', payload);
        updateUser(payload, {
            onSuccess: () => {
                navigation.navigate('MainTabs', { screen: 'Account' });
            }
        });
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.viewHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.viewTitle}>Account Settings</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <FormInput
                        label="First Name"
                        value={firstName}
                        onChangeText={(text: string) => {
                            setFirstName(capitalizeFirstLetter(text));
                            if (errors.firstName) setErrors((prev: any) => ({ ...prev, firstName: null }));
                        }}
                        placeholder="Enter First Name"
                        error={errors.firstName}
                    />

                    <FormInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={(text: string) => {
                            setLastName(capitalizeFirstLetter(text));
                            if (errors.lastName) setErrors((prev: any) => ({ ...prev, lastName: null }));
                        }}
                        placeholder="Enter Last Name"
                        error={errors.lastName}
                    />

                    <FormInput
                        label="Email"
                        value={email}
                        onChangeText={(text: string) => {
                            setEmail(text);
                            if (errors.email) setErrors((prev: any) => ({ ...prev, email: null }));
                        }}
                        placeholder="test@gmail.com"
                        icon={Mail}
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Date of Birth</Text>
                        <TouchableOpacity
                            style={styles.inputWrapper}
                            onPress={() => setIsDatePickerVisible(true)}
                            activeOpacity={0.7}
                        >
                            <Calendar size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                            <Text style={[styles.input, !dob && { color: COLORS.textMuted }]}>
                                {formatDateForDisplay(dob) || 'DD/MM/YYYY'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <View style={styles.genderContainer}>
                            {['Male', 'Female'].map((item) => {
                                const isActive = gender?.toLowerCase() === item.toLowerCase();
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.genderButton,
                                            isActive && styles.genderButtonActive
                                        ]}
                                        onPress={() => setGender(item)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.genderButtonText,
                                            isActive && styles.genderButtonTextActive
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <FormInput
                        label="Phone Number"
                        value={phone}
                        onChangeText={(text: string) => {
                            setPhone(text);
                            if (errors.phone) setErrors((prev: any) => ({ ...prev, phone: null }));
                        }}
                        placeholder="0123-456-780"
                        icon={Smartphone}
                        keyboardType="phone-pad"
                        error={errors.phone}
                    />

                    <TouchableOpacity
                        style={[styles.updateButton, isUpdatingProfile && styles.disabledButton]}
                        onPress={handleUpdate}
                        disabled={isUpdatingProfile}
                    >
                        {isUpdatingProfile ? (
                            <ActivityIndicator color={COLORS.background} />
                        ) : (
                            <Text style={styles.updateButtonText}>Update Account</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                <Modal
                    visible={isDatePickerVisible}
                    transparent={true}
                    animationType="slide"
                    statusBarTranslucent={true}
                    onRequestClose={() => setIsDatePickerVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setIsDatePickerVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Select Birthdate</Text>

                                    <View style={styles.pickerContainer}>
                                        <View style={styles.pickerColumn}>
                                            <Text style={styles.pickerLabel}>Day</Text>
                                            <ScrollView
                                                ref={dayScrollRef}
                                                showsVerticalScrollIndicator={false}
                                            >
                                                {Array.from({ length: getDaysInMonth(parseInt(selectedMonth), parseInt(selectedYear)) }, (_, i) => (i + 1).toString().padStart(2, '0')).map(day => (
                                                    <TouchableOpacity key={day} onPress={() => setSelectedDay(day)} style={[styles.pickerItem, selectedDay === day && styles.pickerItemActive]}>
                                                        <Text style={[styles.pickerItemText, selectedDay === day && styles.pickerItemTextActive]}>{day}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>

                                        <View style={styles.pickerColumn}>
                                            <Text style={styles.pickerLabel}>Month</Text>
                                            <ScrollView
                                                ref={monthScrollRef}
                                                showsVerticalScrollIndicator={false}
                                            >
                                                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(month => (
                                                    <TouchableOpacity key={month} onPress={() => setSelectedMonth(month)} style={[styles.pickerItem, selectedMonth === month && styles.pickerItemActive]}>
                                                        <Text style={[styles.pickerItemText, selectedMonth === month && styles.pickerItemTextActive]}>{month}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>

                                        <View style={styles.pickerColumn}>
                                            <Text style={styles.pickerLabel}>Year</Text>
                                            <ScrollView
                                                ref={yearScrollRef}
                                                showsVerticalScrollIndicator={false}
                                            >
                                                {Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString()).map(year => (
                                                    <TouchableOpacity key={year} onPress={() => setSelectedYear(year)} style={[styles.pickerItem, selectedYear === year && styles.pickerItemActive]}>
                                                        <Text style={[styles.pickerItemText, selectedYear === year && styles.pickerItemTextActive]}>{year}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={handleConfirmDate}
                                    >
                                        <Text style={styles.confirmButtonText}>Confirm</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => setIsDatePickerVisible(false)}
                                    >
                                        <Text style={styles.modalCloseButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    viewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    viewTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: COLORS.background,
    },
    inputIcon: {
        marginRight: 10,
    },
    inputIconRight: {
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    inputWrapperError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    genderButtonActive: {
        backgroundColor: '#000000',
        borderColor: '#000000',
    },
    genderButtonText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    genderButtonTextActive: {
        color: '#FFFFFF',
    },
    updateButton: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
    updateButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#cececeff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        height: 200,
        marginBottom: 20,
    },
    pickerColumn: {
        flex: 1,
        alignItems: 'center',
    },
    pickerLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pickerItem: {
        height: 44,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    pickerItemActive: {
        backgroundColor: '#000',
        padding: 10,
    },
    pickerItemText: {
        fontSize: 16,
        color: COLORS.text,
    },
    pickerItemTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: '#000000',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 10,
    },
    modalCloseButtonText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
});
