import {useNavigation} from '@react-navigation/native';
import {Button, Icon, Text, useTheme} from '@rneui/themed';
import moment from 'moment';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useAppTheme, useStyles} from '../../../theme/theme';
import {formatRupees} from '../../../utils/currency';
import {fetchDocumentsAPI} from '../store/api';
import {useTranslation} from 'react-i18next';

const TABS = [
  {key: undefined, label: 'documents.all'},
  {key: 'quotation', label: 'documents.quotations'},
  {key: 'invoice', label: 'documents.invoices'},
];

function DocumentCard({doc, onPress}) {
  const {t} = useTranslation();
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const {theme} = useTheme();
  const isInvoice = doc.type === 'invoice';
  const color = isInvoice ? theme.colors.primary : theme.colors.secondary;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: ui.border}}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={t('documents.cardLabel', {
        type: isInvoice ? t('documents.invoice') : t('documents.quotation'),
        number: doc.number,
        customer: doc.customer_name,
      })}>
      <View style={[styles.cardIcon, {backgroundColor: color + '26'}]}>
        <Icon
          name={isInvoice ? 'receipt-long' : 'request-quote'}
          type="material"
          size={22}
          color={color}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.customer} numberOfLines={1}>
          {doc.customer_name}
        </Text>
        <Text style={styles.number}>{doc.number}</Text>
        <Text style={styles.meta}>
          {moment(doc.date).format('DD MMM YYYY')}
          {doc.customer_phone ? `  ·  ${doc.customer_phone}` : ''}
        </Text>
        {!!doc.created_by && (
          <View style={styles.creator}>
            <Icon
              name="person-outline"
              type="material"
              size={13}
              color={ui.faint}
            />
            <Text style={styles.creatorText} numberOfLines={1}>
              {doc.created_by}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.total}>{formatRupees(doc.total)}</Text>
        <View style={[styles.badge, {backgroundColor: color + '1F'}]}>
          <Text style={[styles.badgeText, {color}]}>
            {isInvoice
              ? t('documents.invoiceBadge')
              : t('documents.quoteBadge')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function Documents() {
  const {t} = useTranslation();
  const {ui, isDark} = useAppTheme();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [type, setType] = useState(undefined);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | refreshing | ready | error
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  // In-flight request, cancelled when the filters change or the screen closes.
  const controller = useRef(null);
  // Ref, not state: onEndReached can fire twice before a state update lands.
  const fetchingMore = useRef(false);

  // Wait until typing pauses before searching.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // First page only; later pages load as the user scrolls (loadMore).
  const load = useCallback(
    async ({refreshing = false} = {}) => {
      controller.current?.abort();
      const request = new AbortController();
      controller.current = request;
      fetchingMore.current = false;
      setLoadingMore(false);
      setLoadMoreFailed(false);
      setStatus(refreshing ? 'refreshing' : 'loading');
      try {
        const data = await fetchDocumentsAPI({
          type,
          search: query,
          signal: request.signal,
        });
        setDocs(data.results);
        setNextCursor(data.next_cursor);
        setStatus('ready');
      } catch (err) {
        if (!request.signal.aborted) {
          console.log(err);
          setStatus('error');
        }
      }
    },
    [type, query],
  );

  // Load when the screen opens and whenever the tab or search changes. Coming back
  // from a document keeps the list and scroll position; pull down to refresh.
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => () => controller.current?.abort(), []);

  const loadMore = async () => {
    if (!nextCursor || fetchingMore.current || status !== 'ready') {
      return;
    }
    fetchingMore.current = true;
    const request = controller.current;
    setLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const data = await fetchDocumentsAPI({
        type,
        search: query,
        cursor: nextCursor,
        signal: request?.signal,
      });
      setDocs(prev => [...prev, ...data.results]);
      setNextCursor(data.next_cursor);
    } catch (err) {
      if (!request?.signal.aborted) {
        console.log(err);
        setLoadMoreFailed(true);
      }
    } finally {
      if (!request?.signal.aborted) {
        fetchingMore.current = false;
        setLoadingMore(false);
      }
    }
  };

  const renderEmpty = () => {
    if (status === 'loading') {
      return (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        </View>
      );
    }
    if (status === 'error') {
      return (
        <View style={styles.state}>
          <Icon name="cloud-off" type="material" size={40} color={ui.faint} />
          <Text style={styles.stateTitle}>{t('documents.loadFailed')}</Text>
          <Text style={styles.stateText}>{t('common.checkConnection')}</Text>
          <Button
            title={t('common.tryAgain')}
            raised={false}
            color="secondary"
            onPress={() => load()}
            containerStyle={styles.retry}
            buttonStyle={styles.retryButton}
          />
        </View>
      );
    }
    return (
      <View style={styles.state}>
        <Icon
          name={query ? 'search-off' : 'description'}
          type="material"
          size={40}
          color={ui.faint}
        />
        <Text style={styles.stateTitle}>
          {query ? t('documents.noMatches') : t('documents.empty')}
        </Text>
        <Text style={styles.stateText}>
          {query
            ? t('documents.nothingFound', {query})
            : t('documents.emptyHint')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.controls}>
        <View style={styles.search}>
          <Icon name="search" type="material" size={22} color={ui.faint} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('documents.searchPlaceholder')}
            placeholderTextColor={ui.faint}
            keyboardAppearance={isDark ? 'dark' : 'light'}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {search !== '' && (
            <Pressable
              onPress={() => setSearch('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t('documents.clearSearch')}>
              <Icon name="close" type="material" size={20} color={ui.muted} />
            </Pressable>
          )}
        </View>

        <View style={styles.tabs} accessibilityRole="tablist">
          {TABS.map(tab => {
            const active = tab.key === type;
            return (
              <Pressable
                key={tab.label}
                onPress={() => setType(tab.key)}
                style={[styles.tab, active && styles.tabActive]}
                accessibilityRole="tab"
                accessibilityState={{selected: active}}>
                <Text
                  style={[
                    styles.tabText,
                    active && styles.tabTextActive,
                    active && {color: theme.colors.primary},
                  ]}>
                  {t(tab.label)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={status === 'error' ? [] : docs}
        keyExtractor={doc => `${doc.type}-${doc.id}`}
        renderItem={({item}) => (
          <DocumentCard
            doc={item}
            onPress={() => navigation.navigate('document_viewer', {doc: item})}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              style={styles.footerSpinner}
              color={theme.colors.secondary}
            />
          ) : loadMoreFailed ? (
            <Pressable
              onPress={loadMore}
              style={styles.footerRetry}
              accessibilityRole="button">
              <Text style={styles.footerRetryText}>
                {t('documents.loadMoreFailed')}
              </Text>
            </Pressable>
          ) : (
            <View style={{height: 20}} />
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={status === 'refreshing'}
            onRefresh={() => load({refreshing: true})}
            colors={[theme.colors.secondary]}
          />
        }
      />
    </View>
  );
}

export default Documents;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    controls: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ui.card,
      borderRadius: 14,
      paddingHorizontal: 12,
      minHeight: 48,
      borderWidth: 1,
      borderColor: ui.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: ui.text,
      marginLeft: 8,
      paddingVertical: 10,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: ui.border + '99',
      borderRadius: 12,
      padding: 4,
      marginTop: 12,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 9,
    },
    tabActive: {
      backgroundColor: ui.card,
      ...cardShadow,
      elevation: 1,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: ui.muted,
    },
    tabTextActive: {
      fontWeight: '700',
    },
    list: {
      padding: 16,
      paddingTop: 8,
      flexGrow: 1,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ui.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
      overflow: 'hidden',
      ...cardShadow,
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    cardBody: {
      flex: 1,
      marginRight: 8,
    },
    customer: {
      fontSize: 16,
      fontWeight: '600',
      color: ui.text,
    },
    number: {
      fontSize: 13,
      color: ui.muted,
      marginTop: 2,
    },
    meta: {
      fontSize: 12,
      color: ui.faint,
      marginTop: 2,
    },
    creator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 3,
    },
    creatorText: {
      fontSize: 12,
      color: ui.faint,
      marginLeft: 3,
    },
    cardRight: {
      alignItems: 'flex-end',
    },
    total: {
      fontSize: 16,
      fontWeight: '700',
      color: ui.text,
    },
    badge: {
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginTop: 6,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    state: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
      paddingHorizontal: 32,
    },
    stateTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: ui.text,
      marginTop: 12,
    },
    stateText: {
      fontSize: 14,
      color: ui.muted,
      textAlign: 'center',
      marginTop: 4,
    },
    retry: {
      width: 'auto',
      marginTop: 20,
    },
    retryButton: {
      borderRadius: 12,
      paddingHorizontal: 24,
    },
    footerRetry: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    footerRetryText: {
      fontSize: 14,
      fontWeight: '600',
      color: ui.secondary,
    },
    footerSpinner: {
      marginVertical: 16,
    },
  });
