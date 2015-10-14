package jmc.trazaweb;

// Generated 04-may-2015 1:14:29 by Hibernate Tools 3.4.0.CR1

import java.util.List;
import javax.naming.InitialContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.SessionFactory;
import static org.hibernate.criterion.Example.create;

/**
 * Home object for domain model class NumerKar.
 * @see jmc.trazaweb.NumerKar
 * @author Hibernate Tools
 */
public class NumerKarHome {

	private static final Log log = LogFactory.getLog(NumerKarHome.class);

	private final SessionFactory sessionFactory = getSessionFactory();

	protected SessionFactory getSessionFactory() {
		try {
			return (SessionFactory) new InitialContext()
					.lookup("SessionFactory");
		} catch (Exception e) {
			log.error("Could not locate SessionFactory in JNDI", e);
			throw new IllegalStateException(
					"Could not locate SessionFactory in JNDI");
		}
	}

	public void persist(NumerKar transientInstance) {
		log.debug("persisting NumerKar instance");
		try {
			sessionFactory.getCurrentSession().persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void attachDirty(NumerKar instance) {
		log.debug("attaching dirty NumerKar instance");
		try {
			sessionFactory.getCurrentSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(NumerKar instance) {
		log.debug("attaching clean NumerKar instance");
		try {
			sessionFactory.getCurrentSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void delete(NumerKar persistentInstance) {
		log.debug("deleting NumerKar instance");
		try {
			sessionFactory.getCurrentSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public NumerKar merge(NumerKar detachedInstance) {
		log.debug("merging NumerKar instance");
		try {
			NumerKar result = (NumerKar) sessionFactory.getCurrentSession()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public NumerKar findById(int id) {
		log.debug("getting NumerKar instance with id: " + id);
		try {
			NumerKar instance = (NumerKar) sessionFactory.getCurrentSession()
					.get("jmc.trazaweb.NumerKar", id);
			if (instance == null) {
				log.debug("get successful, no instance found");
			} else {
				log.debug("get successful, instance found");
			}
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<NumerKar> findByExample(NumerKar instance) {
		log.debug("finding NumerKar instance by example");
		try {
			List<NumerKar> results = (List<NumerKar>) sessionFactory
					.getCurrentSession()
					.createCriteria("jmc.trazaweb.NumerKar")
					.add(create(instance)).list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}
}
