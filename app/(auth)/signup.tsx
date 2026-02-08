import { useAuth } from '@/contexts/auth-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the Terms and Conditions and Privacy Policy to continue');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else {
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    }
  };

  const handleTermsPress = () => {
    setModalType('terms');
    setModalVisible(true);
  };

  const handlePrivacyPress = () => {
    setModalType('privacy');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Check if form is valid
  const isFormValid = 
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    acceptedTerms;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {/* Terms and Conditions Agreement */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
            style={styles.checkboxContainer}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <View style={styles.termsTextContainer}>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink} onPress={handleTermsPress}>
                Terms and Conditions
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => router.push('/(auth)/login')}>
            Sign in
          </Text>
        </Text>
      </View>

      {/* Terms and Privacy Policy Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, modalType === 'terms' && styles.tabActive]}
                onPress={() => setModalType('terms')}
              >
                <Text style={[styles.tabText, modalType === 'terms' && styles.tabTextActive]}>
                  Terms
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, modalType === 'privacy' && styles.tabActive]}
                onPress={() => setModalType('privacy')}
              >
                <Text style={[styles.tabText, modalType === 'privacy' && styles.tabTextActive]}>
                  Privacy
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
              {modalType === 'terms' ? (
                <View style={styles.contentSection}>
                  <Text style={styles.contentTitle}>Terms and Conditions</Text>
                  <Text style={styles.contentText}>
                    Last updated: {new Date().toLocaleDateString()}
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}1. Acceptance of Terms
                    {'\n\n'}By accessing and using this dating app, you accept and agree to be bound by the terms and provision of this agreement.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}2. User Accounts
                    {'\n\n'}You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}3. User Conduct
                    {'\n\n'}You agree to use the app in a respectful manner and not to harass, abuse, or harm other users. Any inappropriate behavior may result in account termination.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}4. Content
                    {'\n\n'}You are responsible for all content you post. You agree not to post content that is illegal, harmful, or violates others' rights.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}5. Privacy
                    {'\n\n'}Your use of the app is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}6. Termination
                    {'\n\n'}We reserve the right to terminate or suspend your account at any time for violations of these terms.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}7. Limitation of Liability
                    {'\n\n'}The app is provided "as is" without warranties. We are not liable for any damages arising from your use of the app.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}8. Changes to Terms
                    {'\n\n'}We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance.
                  </Text>
                </View>
              ) : (
                <View style={styles.contentSection}>
                  <Text style={styles.contentTitle}>Privacy Policy</Text>
                  <Text style={styles.contentText}>
                    Last updated: {new Date().toLocaleDateString()}
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}1. Information We Collect
                    {'\n\n'}We collect information you provide directly, including profile information, photos, messages, and usage data.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}2. How We Use Your Information
                    {'\n\n'}We use your information to provide, maintain, and improve our services, to match you with other users, and to communicate with you.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}3. Information Sharing
                    {'\n\n'}We do not sell your personal information. We share information only as necessary to provide our services, with your consent, or as required by law.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}4. Profile Information
                    {'\n\n'}Your profile information, including photos and bio, is visible to other users of the app. You control what information you share.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}5. Messages
                    {'\n\n'}Messages between users are private and encrypted. We do not read or monitor your private messages except as necessary to provide our services or as required by law.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}6. Data Security
                    {'\n\n'}We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}7. Your Rights
                    {'\n\n'}You have the right to access, update, or delete your personal information at any time through your account settings.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}8. Cookies and Tracking
                    {'\n\n'}We use cookies and similar technologies to improve your experience and analyze app usage.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}9. Children's Privacy
                    {'\n\n'}Our app is not intended for users under 18 years of age. We do not knowingly collect information from children.
                  </Text>
                  <Text style={styles.contentParagraph}>
                    {'\n'}10. Changes to Privacy Policy
                    {'\n\n'}We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  contentSection: {
    paddingBottom: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  contentParagraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
